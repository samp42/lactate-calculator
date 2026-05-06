import {
  ThresholdCalculationMethods,
  ZoneModels,
  type RampTest,
  type RampTestStage,
  type Thresholds,
  type TrainingZone,
  type KeyMetrics,
} from './models'

import { linear_interpolation, polynomial_regression, discretize, discretizeN, findDmaxThreshold, findLogLogLT1, findPiecewiseBreakpointIndex } from './math'

// for modified dmax, point before first increase of > 0.4 mmol/L
function point_before_first_increase(test: RampTest): RampTestStage | null {
  for (let i = 0; i < test.stages.length - 1; i++) {
    if ((test.stages[i + 1]!.lactate ?? 0) - (test.stages[i]!.lactate ?? 0) > 0.4) {
      return test.stages[i] ?? null
    }
  }

  return null
}

function heart_rate_at_intensity(test: RampTest, intensity: number): number | null {
  for (let i = 0; i < test.stages.length; i++) {
    const s = test.stages[i]!
    const next = test.stages[i + 1]

    if (s.intensity === intensity) return s.heart_rate

    if (s.intensity != null && next?.intensity != null && s.intensity < intensity && next.intensity > intensity) {
      return Math.round(linear_interpolation(s.heart_rate!, s.intensity, next.heart_rate!, next.intensity, intensity))
    }
  }
  return null
}

function intensity_at_heart_rate(test: RampTest, hr: number): number | null {
  for (let i = 0; i < test.stages.length; i++) {
    const s = test.stages[i]!
    const next = test.stages[i + 1]

    if (s.heart_rate === hr) return s.intensity

    if (s.heart_rate != null && next?.heart_rate != null && s.heart_rate < hr && next.heart_rate > hr) {
      return Math.round(linear_interpolation(s.intensity!, s.heart_rate, next.intensity!, next.heart_rate, hr))
    }
  }
  return null
}

function find_stages_around_lactate(test: RampTest, lactate: number): Array<RampTestStage> {
  // TODO: edge cases
  for (let i = 0; i < test.stages.length; i++) {
    if (test.stages[i]!.lactate === lactate) {
      return [test.stages[i]!]
    }

    if ((test.stages[i]!.lactate ?? -Infinity) < lactate && (test.stages[i + 1]?.lactate ?? Infinity) > lactate) {
      return [test.stages[i]!, test.stages[i + 1]!]
    }
  }
  return []
}

export function calculateThresholds(
  test: RampTest,
  method: ThresholdCalculationMethods,
  polynomial_order: 2 | 3 | 4 = 3,
): Thresholds {
  const thresholds: Thresholds = {
    lt1_heart_rate: null,
    lt1_intensity: null,
    lt2_heart_rate: null,
    lt2_intensity: null,
    method: method,
  }

  if (test.stages.length < 4) {
    throw Error('At least 4 stages are required to calculate thresholds')
  }

  const coefficients = polynomial_regression(
    test.stages.map((s) => s.intensity ?? 0),
    test.stages.map((s) => s.lactate ?? 0),
    polynomial_order,
  )

  const curve = discretize(
    Math.min(...test.stages.map((s) => s.intensity ?? 0)),
    Math.max(...test.stages.map((s) => s.intensity ?? 0)),
    coefficients,
  )

  switch (method) {
    case ThresholdCalculationMethods.DMAX: {
      const first_stage = test.stages[0]!
      const last_stage = test.stages[test.stages.length - 1]!

      const fs_intensity = first_stage.intensity!
      const fs_lactate = first_stage.lactate!
      const ls_intensity = last_stage.intensity!
      const ls_lactate = last_stage.lactate!

      const poly_indices = curve.x.map((_, i) => i).filter(i => curve.x[i]! >= fs_intensity && curve.x[i]! <= ls_intensity)
      const poly_x = poly_indices.map(i => curve.x[i]!)
      const poly_y = poly_indices.map(i => curve.y[i]!)

      const lt2_intensity = findDmaxThreshold(
        [fs_intensity, ls_intensity],
        [fs_lactate, ls_lactate],
        poly_x,
        poly_y,
      )

      const lt1_intensity_dmax = findLogLogLT1(
        test.stages.map(s => s.intensity!),
        test.stages.map(s => s.lactate!),
      )

      return {
        method: ThresholdCalculationMethods.DMAX,
        lt1_heart_rate: heart_rate_at_intensity(test, lt1_intensity_dmax),
        lt1_intensity: lt1_intensity_dmax,
        lt2_heart_rate: heart_rate_at_intensity(test, lt2_intensity),
        lt2_intensity: lt2_intensity,
      }
    }
    case ThresholdCalculationMethods.MODIFIED_DMAX: {
      const base_point = point_before_first_increase(test) ?? test.stages[0]!
      const last_stage = test.stages[test.stages.length - 1]!

      const bp_intensity = base_point.intensity!
      const bp_lactate = base_point.lactate!
      const ls_intensity = last_stage.intensity!
      const ls_lactate = last_stage.lactate!

      // Filter polynomial curve to the intensity range [base_point, last_stage]
      const poly_indices = curve.x.map((_, i) => i).filter(i => curve.x[i]! >= bp_intensity && curve.x[i]! <= ls_intensity)
      const poly_x = poly_indices.map(i => curve.x[i]!)
      const poly_y = poly_indices.map(i => curve.y[i]!)

      const lt2_intensity = findDmaxThreshold(
        [bp_intensity, ls_intensity],
        [bp_lactate, ls_lactate],
        poly_x,
        poly_y,
      )

      const lt1_intensity_mdmax = findLogLogLT1(
        test.stages.map(s => s.intensity!),
        test.stages.map(s => s.lactate!),
      )

      return {
        method: ThresholdCalculationMethods.MODIFIED_DMAX,
        lt1_heart_rate: heart_rate_at_intensity(test, lt1_intensity_mdmax),
        lt1_intensity: lt1_intensity_mdmax,
        lt2_heart_rate: heart_rate_at_intensity(test, lt2_intensity),
        lt2_intensity: lt2_intensity,
      }
    }
    case ThresholdCalculationMethods.LOG_LOG_DMAX: {
      const logX = test.stages.map(s => Math.log(s.intensity!))
      const logY = test.stages.map(s => Math.log(s.lactate!))

      const logCoef = polynomial_regression(logX, logY, polynomial_order)
      const logCurve = discretizeN(Math.min(...logX), Math.max(...logX), logCoef)

      const lt2_log = findDmaxThreshold(
        [logX[0]!, logX[logX.length - 1]!],
        [logY[0]!, logY[logY.length - 1]!],
        logCurve.x,
        logCurve.y,
      )
      const lt2_intensity = Math.round(Math.exp(lt2_log))

      const lt1_intensity = findLogLogLT1(
        test.stages.map(s => s.intensity!),
        test.stages.map(s => s.lactate!),
      )

      return {
        method: ThresholdCalculationMethods.LOG_LOG_DMAX,
        lt1_intensity,
        lt1_heart_rate: heart_rate_at_intensity(test, lt1_intensity),
        lt2_intensity,
        lt2_heart_rate: heart_rate_at_intensity(test, lt2_intensity),
      }
    }
    case ThresholdCalculationMethods.POLYNOMIAL_CURVE_FITTING:
      return thresholds
    case ThresholdCalculationMethods.HR_LACTATE_COUPLING: {
      const hrs = test.stages.map(s => s.heart_rate!)
      const lactates = test.stages.map(s => s.lactate!)

      // LT2: piecewise linear breakpoint in HR-lactate space (the dramatic decoupling)
      const lt2_hr = hrs[findPiecewiseBreakpointIndex(hrs, lactates)]!
      const lt2_intensity = intensity_at_heart_rate(test, lt2_hr)

      // LT1: piecewise linear breakpoint in log-log HR-lactate space (the earlier aerobic inflection)
      const logHR = hrs.map(h => Math.log(h))
      const logLac = lactates.map(l => Math.log(l))
      const lt1_hr = hrs[findPiecewiseBreakpointIndex(logHR, logLac)]!
      const lt1_intensity = intensity_at_heart_rate(test, lt1_hr)

      return {
        method: ThresholdCalculationMethods.HR_LACTATE_COUPLING,
        lt1_intensity,
        lt1_heart_rate: lt1_hr,
        lt2_intensity,
        lt2_heart_rate: lt2_hr,
      }
    }
    case ThresholdCalculationMethods.FIXED_LACTATE_THRESHOLDS:
      const lt1_lact = 2
      const lt2_lact = 4

      const stages_lt1 = find_stages_around_lactate(test, lt1_lact)

      thresholds.lt1_heart_rate = linear_interpolation(
        stages_lt1[0]?.heart_rate ?? 0,
        stages_lt1[0]?.lactate ?? 0,
        stages_lt1[1]?.heart_rate ?? 0,
        stages_lt1[1]?.lactate ?? 0,
        lt1_lact,
      )
      thresholds.lt1_intensity = linear_interpolation(
        stages_lt1[0]?.intensity ?? 0,
        stages_lt1[0]?.lactate ?? 0,
        stages_lt1[1]?.intensity ?? 0,
        stages_lt1[1]?.lactate ?? 0,
        lt1_lact,
      )

      const stages_lt2 = find_stages_around_lactate(test, lt2_lact)

      thresholds.lt2_heart_rate = linear_interpolation(
        stages_lt2[0]?.heart_rate ?? 0,
        stages_lt2[0]?.lactate ?? 0,
        stages_lt2[1]?.heart_rate ?? 0,
        stages_lt2[1]?.lactate ?? 0,
        lt2_lact,
      )
      thresholds.lt2_intensity = linear_interpolation(
        stages_lt2[0]?.intensity ?? 0,
        stages_lt2[0]?.lactate ?? 0,
        stages_lt2[1]?.intensity ?? 0,
        stages_lt2[1]?.lactate ?? 0,
        lt2_lact,
      )

      return thresholds
    case ThresholdCalculationMethods.LOG_LOG_LT:
      return thresholds
    case ThresholdCalculationMethods.BASELINE_0_5:
      return thresholds
    default:
      throw Error('Unkown calculation method')
  }
}

export function calculateZones(
  test: RampTest,
  thresholds: Thresholds,
  model: ZoneModels,
): { intensity_zones: Array<TrainingZone>; heart_rate_zones: Array<TrainingZone> } {
  const max_hr = Math.max(...test.stages.map((s) => s.heart_rate ?? 0))

  switch (model) {
    // case ZoneModels.THREE_ZONES:
    //   const hr_zones: Array<TrainingZone> = [
    //     {
    //       number: 1,
    //       description: 'Low / Endurance',
    //       min: null,
    //       max: Math.round(0.8 * max_hr),
    //       min_percent: null,
    //       max_percent: 80,
    //     },
    //     {
    //       number: 2,
    //       description: 'Threshold / Moderate',
    //       min: Math.round(0.8 * max_hr),
    //       max: Math.round(0.87 * max_hr),
    //       min_percent: 80,
    //       max_percent: 87,
    //     },
    //     {
    //       number: 3,
    //       description: 'High / Severe',
    //       min: Math.round(0.87 * max_hr),
    //       max: max_hr,
    //       min_percent: 87,
    //       max_percent: 100,
    //     },
    //   ]

    //   const intensity_zones: Array<TrainingZone> = [
    //     {
    //       number: 1,
    //       description: 'Low / Endurance',
    //       min: null,
    //       max: Math.round(0.8 * max_hr),
    //       min_percent: null,
    //       max_percent: 80,
    //     },
    //     {
    //       number: 2,
    //       description: 'Threshold / Moderate',
    //       min: Math.round(0.8 * max_hr),
    //       max: Math.round(0.87 * max_hr),
    //       min_percent: 80,
    //       max_percent: 87,
    //     },
    //     {
    //       number: 3,
    //       description: 'High / Severe',
    //       min: Math.round(0.87 * max_hr),
    //       max: max_hr,
    //       min_percent: 87,
    //       max_percent: 100,
    //     },
    //   ]
    case ZoneModels.FIVE_ZONES: {
      /**
       * Power zones:
       * Zone 1: < LT1
       * Zone 2: LT1 - LT2
       * Zone 3: LT2 - FTP
       * Zone 4: FTP - 120% FTP
       * Zone 5: > 120% FTP
       *
       * Heart rate zones:
       * Zone 1: 50-60% of max HR
       * Zone 2: 60-70% of max HR
       * Zone 3: 70-80% of max HR
       * Zone 4: 80-90% of max HR
       * Zone 5: 90-100% of max HR
       */

      const ftp = Math.round(0.75 * calculatePeakOneMinutePower(test))
      const lt1 = thresholds.lt1_intensity
      const lt2 = thresholds.lt2_intensity

      const hr_zones: Array<TrainingZone> = [
        {
          number: 1,
          description: 'Recovery',
          min: Math.round(0.5 * max_hr),
          max: Math.round(0.6 * max_hr),
          min_percent: 50,
          max_percent: 60,
        },
        {
          number: 2,
          description: 'Endurance',
          min: Math.round(0.6 * max_hr),
          max: Math.round(0.7 * max_hr),
          min_percent: 60,
          max_percent: 70,
        },
        {
          number: 3,
          description: 'Threshold',
          min: Math.round(0.7 * max_hr),
          max: Math.round(0.8 * max_hr),
          min_percent: 70,
          max_percent: 80,
        },
        {
          number: 4,
          description: 'VO2 Max',
          min: Math.round(0.8 * max_hr),
          max: Math.round(0.9 * max_hr),
          min_percent: 80,
          max_percent: 90,
        },
        {
          number: 5,
          description: 'Neuromuscular',
          min: Math.round(0.9 * max_hr),
          max: max_hr,
          min_percent: 90,
          max_percent: 100,
        },
      ]

      const intensity_zones: Array<TrainingZone> = [
        {
          number: 1,
          description: 'Recovery',
          min: 0,
          max: lt1 != null ? Math.round(lt1) : null,
          min_percent: 0,
          max_percent: lt1 != null ? Math.round((lt1 / ftp) * 100) : null,
        },
        {
          number: 2,
          description: 'Endurance',
          min: lt1 != null ? Math.round(lt1) : null,
          max: lt2 != null ? Math.round(lt2) : null,
          min_percent: lt1 != null ? Math.round((lt1 / ftp) * 100) : null,
          max_percent: lt2 != null ? Math.round((lt2 / ftp) * 100) : null,
        },
        {
          number: 3,
          description: 'Threshold',
          min: lt2 != null ? Math.round(lt2) : null,
          max: ftp,
          min_percent: lt2 != null ? Math.round((lt2 / ftp) * 100) : null,
          max_percent: 100,
        },
        {
          number: 4,
          description: 'VO2 Max',
          min: ftp,
          max: Math.round(1.2 * ftp),
          min_percent: 100,
          max_percent: 120,
        },
        {
          number: 5,
          description: 'Neuromuscular',
          min: Math.round(1.2 * ftp),
          max: Infinity,
          min_percent: 120,
          max_percent: Infinity,
        },
      ]

      return {
        intensity_zones,
        heart_rate_zones: hr_zones,
      }
    }
    case ZoneModels.SEVEN_ZONES:
      const ftp = 0.75 * calculatePeakOneMinutePower(test)

      const heart_rate_zones: Array<TrainingZone> = [
        {
          number: 1,
          description: 'Recovery',
          min: null,
          max: Math.round(0.68 * max_hr),
          min_percent: null,
          max_percent: 68,
        },
        {
          number: 2,
          description: 'Endurance',
          min: Math.round(0.68 * max_hr),
          max: Math.round(0.83 * max_hr),
          min_percent: 68,
          max_percent: 83,
        },
        {
          number: 3,
          description: 'Tempo',
          min: Math.round(0.83 * max_hr),
          max: Math.round(0.94 * max_hr),
          min_percent: 83,
          max_percent: 94,
        },
        {
          number: 4,
          description: 'Sweet Spot',
          min: Math.round(0.94 * max_hr),
          max: max_hr,
          min_percent: 94,
          max_percent: 100,
        },
        {
          number: 5,
          description: 'Threshold',
          min: null,
          max: null,
          min_percent: null,
          max_percent: null,
        },
        {
          number: 6,
          description: 'VO2 Max',
          min: null,
          max: null,
          min_percent: null,
          max_percent: null,
        },
        {
          number: 7,
          description: 'Neuromuscular',
          min: null,
          max: null,
          min_percent: null,
          max_percent: null,
        },
      ]

      const intensity_zones: Array<TrainingZone> = [
        {
          number: 1,
          description: 'Recovery',
          min: 0,
          max: Math.round(0.55 * ftp),
          min_percent: 0,
          max_percent: 55,
        },
        {
          number: 2,
          description: 'Endurance',
          min: Math.round(0.55 * ftp),
          max: Math.round(0.75 * ftp),
          min_percent: 55,
          max_percent: 75,
        },
        {
          number: 3,
          description: 'Tempo',
          min: Math.round(0.75 * ftp),
          max: Math.round(0.87 * ftp),
          min_percent: 75,
          max_percent: 87,
        },
        {
          number: 4,
          description: 'Sweet Spot',
          min: Math.round(0.87 * ftp),
          max: Math.round(0.94 * ftp),
          min_percent: 87,
          max_percent: 94,
        },
        {
          number: 5,
          description: 'Threshold',
          min: Math.round(0.94 * ftp),
          max: Math.round(1.05 * ftp),
          min_percent: 94,
          max_percent: 105,
        },
        {
          number: 6,
          description: 'VO2 Max',
          min: Math.round(1.05 * ftp),
          max: Math.round(1.2 * ftp),
          min_percent: 105,
          max_percent: 120,
        },
        {
          number: 7,
          description: 'Neuromuscular',
          min: Math.round(1.2 * ftp),
          max: Infinity,
          min_percent: 120,
          max_percent: Infinity,
        },
      ];

      return {
        intensity_zones: intensity_zones,
        heart_rate_zones: heart_rate_zones,
      }
    default:
      throw Error('Unknown zone model')
  }

}

export function calculateMAP(test: RampTest): number | null {
  const fullStages = test.stages.filter(s => s.intensity != null && s.duration != null && s.duration >= 60)
  if (fullStages.length === 0) return null
  return Math.max(...fullStages.map(s => s.intensity!))
}

export function calculateVO2Max(
  test: RampTest,
  map: number | null,
): { absolute: number; relative: number } | null {
  if (map == null || test.weight == null) return null

  let relative: number
  if (test.sport === 'cycling') {
    // Hawley & Noakes (1992) / ACSM cycling formula
    relative = (10.8 * map) / test.weight + 7
  } else {
    // ACSM running formula: VO2 = 0.2 * speed_m/min + 3.5
    relative = 0.2 * (map * 1000 / 60) + 3.5
  }

  return {
    relative: Math.round(relative * 10) / 10,
    absolute: Math.round((relative * test.weight / 1000) * 100) / 100,
  }
}

export function calculateKeyMetrics(
  test: RampTest,
  method: ThresholdCalculationMethods,
): KeyMetrics {
  const map = calculateMAP(test)
  const vo2 = calculateVO2Max(test, map)

  return {
    athlete_name: test.name,
    athlete_weight: test.weight,
    max_hr: Math.max(...test.stages.map((s) => s.heart_rate ?? 0)),
    ftp: Math.round(0.75 * calculatePeakOneMinutePower(test)),
    map,
    ppo: null,
    vo2_max_absolute: vo2?.absolute ?? null,
    vo2_max_relative: vo2?.relative ?? null,
    thresholds: calculateThresholds(test, method),
    power_zones: [],
    heart_rate_zones: [],
  }
}

export function calculatePeakOneMinutePower(test: RampTest): number {
  let one_minute = 60;
  let peak_power = 0;

  // stages descending
  const stages = test.stages.filter(s => !!s.intensity && !!s.duration)
  let i = stages.length - 1;
  while (one_minute > 0 && i >= 0) {
    const stage = stages[i]!
    if (stage.duration! >= 60) {
      return stage.intensity!;
    }
    const duration = stage.duration!;
    peak_power += stage.intensity! * (duration / (60 - duration))

    one_minute -= duration;
    i -= 1;
  }

  return peak_power;
}

export function speedToPace(speed: number): Array<number> {
  // kph -> s/km
  const pace_sec = Math.round(3600 / speed)

  const minutes = Math.floor(pace_sec / 60)
  const seconds = pace_sec % 60

  return [minutes, seconds]
}
