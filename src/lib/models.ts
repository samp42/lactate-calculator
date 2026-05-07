export interface RampTestStage {
  num: number
  intensity: number | null // power for cycling, speed for running
  duration: number | null
  lactate: number | null
  heart_rate: number | null
}

export interface RampTest {
  name: string | null
  weight: number | null
  sport: 'cycling' | 'running'
  stages: Array<RampTestStage>
}

export interface TrainingZone {
  number: number
  description: string
  min: number | null
  max: number | null
  min_percent: string | number | null
  max_percent: string | number | null
}

export interface Thresholds {
  method: ThresholdCalculationMethods | null
  lt1_intensity: number | null // power / speed
  lt1_heart_rate: number | null
  lt2_intensity: number | null // power / speed
  lt2_heart_rate: number | null
}

export interface KeyMetrics {
  athlete_name: string | null
  athlete_weight: number | null
  max_hr: number | null
  ftp: number | null
  map: number | null
  ppo: number | null
  vo2_max_absolute: number | null
  vo2_max_relative: number | null
  thresholds: Thresholds
  power_zones: Array<TrainingZone>
  heart_rate_zones: Array<TrainingZone>
}

export enum ThresholdCalculationMethods {
  DMAX = 'Dmax', // The original Dmax method as described by Cheng et al. (1992)
  MODIFIED_DMAX = 'Modified Dmax', // First point of distance line is the point before the first increase of >0.4 mmol/L
  LOG_LOG_DMAX = 'Log-Log Dmax',
  POLYNOMIAL_CURVE_FITTING = 'Polynomial Curve Fitting',
  HR_LACTATE_COUPLING = 'Heart Rate-Lactate Coupling',
  FIXED_LACTATE_THRESHOLDS = 'Fixed Lactate Thresholds', // LT1 = 2 mmol/L, LT2 = 4 mmol/L
  LOG_LOG_LT = 'Log-Log LT',
  BASELINE_0_5 = 'Baseline + 0.5', // LT1 = baseline + 0.5 mmol/L, LT2 = baseline + 1.5 mmol/L
  NONE = 'None',
}

export enum ZoneModels {
  THREE_ZONES = '3 Zones',
  FIVE_ZONES = '5 Zones',
  SEVEN_ZONES = '7 Zones',
}

export function getFirstEmptyStage() {
  return [{ num: 1, intensity: null, duration: null, lactate: null, heart_rate: null }]
}

export function getFictiveStages() {
  return [
    { num: 1, intensity: 130, duration: 120, lactate: 0.9, heart_rate: 118 },
    { num: 2, intensity: 160, duration: 120, lactate: 0.8, heart_rate: 126 },
    { num: 3, intensity: 190, duration: 120, lactate: 1, heart_rate: 141 },
    { num: 4, intensity: 220, duration: 120, lactate: 1.6, heart_rate: 148 },
    { num: 5, intensity: 250, duration: 120, lactate: 2.3, heart_rate: 166 },
    { num: 6, intensity: 280, duration: 120, lactate: 4.1, heart_rate: 173 },
    { num: 7, intensity: 310, duration: 120, lactate: 6.9, heart_rate: 182 },
    { num: 8, intensity: 340, duration: 120, lactate: 11.6, heart_rate: 183 },
    { num: 9, intensity: 370, duration: 20, lactate: 14.8, heart_rate: 186 },
  ]
}
