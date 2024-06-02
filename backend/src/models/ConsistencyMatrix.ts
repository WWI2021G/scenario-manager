import { FutureProjection } from "./FutureProjection";

export class ConsistencyMatrix {
  private matrix: Map<FutureProjection, Map<FutureProjection, number>>;

  constructor() {
    this.matrix = new Map();
  }

  getConsistency(
    projectionA: FutureProjection,
    projectionB: FutureProjection,
  ): number | undefined {
    return this.matrix.get(projectionA)?.get(projectionB);
  }

  setConsistency(
    projectionA: FutureProjection,
    projectionB: FutureProjection,
    distance: number,
  ) {
    let innerMap = this.matrix.get(projectionA);
    if (innerMap === undefined) {
      innerMap = new Map<FutureProjection, number>();
    }
    innerMap.set(projectionB, distance);
    this.matrix.set(projectionA, innerMap);
  }

  getMatrix(): Map<FutureProjection, Map<FutureProjection, number>> {
    return this.matrix;
  }
}
