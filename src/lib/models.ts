export interface RampTestStage {
  num: number,
  power: number | null,
  duration: number | null,
  lactate: number | null
}

export interface RampTest {
  stages: Array<RampTestStage>
}
