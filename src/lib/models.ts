export interface RampTestStage {
  num: number
  power: number | null
  duration: number | null
  lactate: number | null
  heart_rate: number | null
}

export interface RampTest {
  name: string | null
  weight: number | null
  stages: Array<RampTestStage>
}

export interface TrainingZone {
  number: number
  description: string
  min: number | null
  max: number | null
  min_percent: number | null
  max_percent: number | null
}

export interface Thresholds {
  method: ZoneCalculationMethods | null
  lt1_power: number | null
  lt1_heart_rate: number | null
  lt2_power: number | null
  lt2_heart_rate: number | null
}

export interface KeyMetrics {
  athlete_name: string | null
  athlete_weight: number | null
  max_hr: number | null
  thresholds: Thresholds
}

// export interface ZoneModels

export enum ZoneCalculationMethods {
  DMAX = 'Dmax', // The original Dmax method as described by Cheng et al. (1992)
  MODIFIED_DMAX = 'Modified Dmax', // First point of distance line is the point before the first increase of >0.4 mmol/L
  LOG_LOG_DMAX = 'Log-Log Dmax',
  POLYNOMIAL_CURVE_FITTING = 'Polynomial Curve Fitting',
  HR_LACTATE_COUPLING = 'Heart Rate-Lactate Coupling',
  FIXED_LACTATE_THRESHOLDS = 'Fixed Lactate Thresholds', // LT1 = 2 mmol/L, LT2 = 4 mmol/L
  LOG_LOG_LT = 'Log-Log LT',
  BASELINE_0_5 = 'Baseline + 0.5', // LT1 = baseline + 0.5 mmol/L, LT2 = baseline + 1.5 mmol/L
}
