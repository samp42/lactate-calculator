import {
  ThresholdCalculationMethods,
  ZoneModels,
  type RampTest,
  type RampTestStage,
  type Thresholds,
  type TrainingZone,
} from './models'

import { polynomial_regression, discretize } from './math'

function linear_interpolation(x1: number, y1: number, x2: number, y2: number, a: number): number {
  return ((y2 - y1) / (x2 - x1)) * a + x1
}

function find_stages_around_lactate(test: RampTest, lactate: number): Array<RampTestStage> {
  return []
}

export function calculateThresholds(
  test: RampTest,
  method: ThresholdCalculationMethods,
  polynomial_order: 2 | 3 | 4 = 3,
): Thresholds {
  const thresholds: Thresholds = {
    lt1_heart_rate: null,
    lt1_power: null,
    lt2_heart_rate: null,
    lt2_power: null,
    method: null,
  }

  if (test.stages.length < 4) {
    throw Error('At least 4 stages are required to calculate thresholds')
  }

  switch (method) {
    case ThresholdCalculationMethods.DMAX:
      const coefficients = polynomial_regression(
        test.stages.map((s) => s.power ?? 0),
        test.stages.map((s) => s.lactate ?? 0),
        polynomial_order,
      )

      const curve = discretize(
        Math.min(...test.stages.map((s) => s.power ?? 0)),
        Math.max(...test.stages.map((s) => s.power ?? 0)),
        coefficients,
      )

      return {
        method: ThresholdCalculationMethods.DMAX
      }
    case ThresholdCalculationMethods.MODIFIED_DMAX:
      return {}
    case ThresholdCalculationMethods.LOG_LOG_DMAX:
      return {}
    case ThresholdCalculationMethods.POLYNOMIAL_CURVE_FITTING:
      return {}
    case ThresholdCalculationMethods.HR_LACTATE_COUPLING:
      return {}
    case ThresholdCalculationMethods.FIXED_LACTATE_THRESHOLDS:
      const lt1_lact = 2
      const lt2_lact = 4

      const stages_lt1 = find_stages_around_lactate(test, lt1_lact)
      thresholds.lt1_heart_rate = linear_interpolation(
        stages_lt1[0]?.lactate,
        stages_lt1[0]?.heart_rate,
        stages_lt1[1]?.lactate,
        stages_lt1[1]?.heart_rate,
        lt1_lact,
      )
      thresholds.lt1_power = linear_interpolation(
        stages_lt1[0]?.lactate,
        stages_lt1[0]?.power,
        stages_lt1[1]?.lactate,
        stages_lt1[1]?.power,
        lt1_lact,
      )

      const stages_lt2 = find_stages_around_lactate(test, lt2_lact)
      thresholds.lt2_heart_rate = linear_interpolation(
        stages_lt2[0]?.lactate,
        stages_lt2[0]?.heart_rate,
        stages_lt2[1]?.lactate,
        stages_lt2[1]?.heart_rate,
        lt2_lact,
      )

      thresholds.lt2_power = linear_interpolation(
        stages_lt2[0]?.lactate,
        stages_lt2[0]?.power,
        stages_lt2[1]?.lactate,
        stages_lt2[1]?.power,
        lt2_lact,
      )

      return thresholds
    case ThresholdCalculationMethods.LOG_LOG_LT:
      return {}
    case ThresholdCalculationMethods.BASELINE_0_5:
      const baseline = test.stages[0]

      return {}
    default:
      throw Error('Unkown calculation method')
  }
}

export function calculateZones(
  test: RampTest,
  thresholds: Thresholds,
  model: ZoneModels,
): { power_zones: Array<TrainingZone>; heart_rate_zones: Array<TrainingZone> } {
  switch (model) {
    case ZoneModels.THREE_ZONES:
      break
    case ZoneModels.FIVE_ZONES:
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

      const max_hr = Math.max(...test.stages.map((s) => s.heart_rate ?? 0))

      const hr_zones: Array<TrainingZone> = [
        {
          number: 1,
          description: 'Zone 1',
          min: Math.round(0.5 * max_hr),
          max: Math.round(0.6 * max_hr),
          min_percent: 50,
          max_percent: 60,
        },
        {
          number: 2,
          description: 'Zone 2',
          min: Math.round(0.6 * max_hr),
          max: Math.round(0.7 * max_hr),
          min_percent: 60,
          max_percent: 70,
        },
        {
          number: 3,
          description: 'Zone 3',
          min: Math.round(0.7 * max_hr),
          max: Math.round(0.8 * max_hr),
          min_percent: 70,
          max_percent: 80,
        },
        {
          number: 4,
          description: 'Zone 4',
          min: Math.round(0.8 * max_hr),
          max: Math.round(0.9 * max_hr),
          min_percent: 80,
          max_percent: 90,
        },
        {
          number: 5,
          description: 'Zone 5',
          min: Math.round(0.9 * max_hr),
          max: max_hr,
          min_percent: 90,
          max_percent: 100,
        },
      ]

      return {
        power_zones: [],
        heart_rate_zones: hr_zones,
      }
    case ZoneModels.SEVEN_ZONES:
      const ftp = 0.75 * calculatePeakOneMinutePower(test)

      const power_zones: Array<TrainingZone> = [
        {
          number: 1,
          description: 'Active Recovery',
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
          description: 'Anaerobic Capacity',
          min: Math.round(1.2 * ftp),
          max: Infinity,
          min_percent: 120,
          max_percent: Infinity,
        },
      ];

      return {
        power_zones: power_zones,
        heart_rate_zones: [],
      }
    default:
      throw Error('Unknown zone model')
  }

  return {
    power_zones: [],
    heart_rate_zones: [],
  }
}

export function calculateKeyMetrics(
  test: RampTest,
  method: ThresholdCalculationMethods,
): KeyMetrics {
  return {
    athlete_name: test.athlete_name,
    athlete_weight: test.athlete_weight,
    max_hr: Math.max(...test.stages.map((s) => s.heart_rate)),
    ftp: Math.round(0.75 * calculatePeakOneMinutePower(test)),
    thresholds: calculateThresholds(test, method),
  }
}

export function calculatePeakOneMinutePower(test: RampTest): number {
  let one_minute = 60;
  let peak_power = 0;

  // stages descending
  const stages = test.stages.filter(s => !!s.power && !!s.duration)
  let i = stages.length - 1;
  while (one_minute > 0 && i >= 0) {
    if (stages[i]?.duration >= 60) {
      return stages[i]?.power;
    }
    const duration = stages[i]?.duration;
    peak_power += stages[i]?.power * (duration / (60 - duration))

    one_minute -= duration;
    i -= 1;
  }

  return peak_power;
}
