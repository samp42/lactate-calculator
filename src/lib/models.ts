export interface RampTestStage {
  num: number,
  power: number | null,
  duration: number | null,
  lactate: number | null,
  heart_rate: number | null
}

export interface RampTest {
  name: string | null,
  weight: number | null,
  stages: Array<RampTestStage>
}

export interface TrainingZone {
  number: number,
  description: string,
  min: number | null,
  max: number | null,
  min_percent: number | null,
  max_percent: number | null
}

export interface Thresholds {
  lt1_power: number | null,
  lt1_heart_rate: number | null,
  lt2_power: number | null,
  lt2_heart_rate: number | null
}

export interface KeyMetrics {
  athlete_name: string | null,
  athlete_weight: number | null,
  max_hr: number | null,
  thresholds: Thresholds
}

// export interface ZoneModels

export enum ZoneCalculationMethods {
  DMAX = 'Dmax',
  MODIFIED_DMAX = 'Modified Dmax',
  POLYNOMIAL_CURVE_FITTING = 'Polynomial Curve Fitting',
  HR_LACTATE_COUPLING = 'Heart Rate-Lactate Coupling',
  FIXED_LACTATE_THRESHOLDS = 'Fixed Lactate Thresholds', // LT1 = 2 mmol/L, LT2 = 4 mmol/L
  LOG_LOG_LT = 'Log-Log LT',
  BASELINE_0_5 = 'Baseline + 0.5'
}
