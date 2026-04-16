import { ZoneCalculationMethods, type RampTest, type RampTestStage, type Thresholds } from "./models";

function linear_interpolation(x1: number, y1: number, x2: number, y2: number, a: number): number {
  return ((y2 - y1) / (x2 - x1)) * a + x1;
}

function find_stages_around_lactate(test: RampTest, lactate: number): Array<RampTestStage> {
  return [];
}

export function calculateZones(test: RampTest, method: ZoneCalculationMethods): Thresholds {
  const thresholds: Thresholds = { lt1_heart_rate: null, lt1_power: null, lt2_heart_rate: null, lt2_power: null };

  switch (method) {
    case ZoneCalculationMethods.DMAX:
      return {};
    case ZoneCalculationMethods.MODIFIED_DMAX:
      return {};
    case ZoneCalculationMethods.POLYNOMIAL_CURVE_FITTING:
      return {};
    case ZoneCalculationMethods.HR_LACTATE_COUPLING:
      return {};
    case ZoneCalculationMethods.FIXED_LACTATE_THRESHOLDS:
      const lt1_lact = 2;
      const lt2_lact = 4;

      const stages_lt1 = find_stages_around_lactate(test, lt1_lact);
      thresholds.lt1_heart_rate = linear_interpolation(stages_lt1[0]?.lactate, stages_lt1[0]?.heart_rate, stages_lt1[1]?.lactate, stages_lt1[1]?.heart_rate, lt1_lact);
      thresholds.lt1_power = linear_interpolation(stages_lt1[0]?.lactate, stages_lt1[0]?.power, stages_lt1[1]?.lactate, stages_lt1[1]?.power, lt1_lact);

      const stages_lt2 = find_stages_around_lactate(test, lt2_lact);
      thresholds.lt2_heart_rate = linear_interpolation(stages_lt2[0]?.lactate, stages_lt2[0]?.heart_rate, stages_lt2[1]?.lactate, stages_lt2[1]?.heart_rate, lt2_lact);
      thresholds.lt2_power = linear_interpolation(stages_lt2[0]?.lactate, stages_lt2[0]?.power, stages_lt2[1]?.lactate, stages_lt2[1]?.power, lt2_lact);

      return thresholds;
    case ZoneCalculationMethods.LOG_LOG_LT:
      return {};
    case ZoneCalculationMethods.BASELINE_0_5:
      return {};
    default:
      throw Error("Unkown calculation method");
  }
}
