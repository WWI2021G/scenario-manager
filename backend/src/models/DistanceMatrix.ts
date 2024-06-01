import { ProjectionBundle } from "./ProjectionBundle";

export class DistanceMatrix {
  private matrix: Map<ProjectionBundle, Map<ProjectionBundle, number>>;

  constructor() {
    this.matrix = new Map();
  }

  getDistance(
    bundleA: ProjectionBundle,
    bundleB: ProjectionBundle,
  ): number | undefined {
    return this.matrix.get(bundleA)?.get(bundleB);
  }

  setDistance(
    bundleA: ProjectionBundle,
    bundleB: ProjectionBundle,
    distance: number,
  ) {
    let innerMap = this.matrix.get(bundleA);
    if (innerMap === undefined) {
      innerMap = new Map<ProjectionBundle, number>();
    }
    innerMap.set(bundleB, distance);
    this.matrix.set(bundleA, innerMap);
  }

  getMatrix(): Map<ProjectionBundle, Map<ProjectionBundle, number>> {
    return this.matrix;
  }
}
