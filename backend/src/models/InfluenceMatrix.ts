import { InfluencingFactor } from "./InfluencingFactor";

export class InfluenceMatrix {
  private matrix: Map<InfluencingFactor, Map<InfluencingFactor, number>>;

  constructor() {
    this.matrix = new Map();
  }

  getInfluence(
    factorA: InfluencingFactor,
    factorB: InfluencingFactor,
  ): number | undefined {
    return this.matrix.get(factorA)?.get(factorB);
  }

  setDistance(
    factorA: InfluencingFactor,
    factorB: InfluencingFactor,
    distance: number,
  ) {
    let innerMap = this.matrix.get(factorA);
    if (!innerMap) {
      innerMap = new Map<InfluencingFactor, number>();
    }
    innerMap.set(factorB, distance);
    this.matrix.set(factorA, innerMap);
  }

  getMatrix(): Map<InfluencingFactor, Map<InfluencingFactor, number>> {
    return this.matrix;
  }

  getActiveSum(factor: InfluencingFactor): number | undefined {
    const innerMap = this.matrix.get(factor);
    if (!innerMap) {
      return undefined;
    }
    let sum = 0;
    innerMap.forEach(value => {
      sum += value;
    });
    return sum;
  }

  getPassiveSum(factor: InfluencingFactor): number | undefined {
    let sum = 0;
    this.matrix.forEach((innerMap, _) => {
      if (innerMap.has(factor)) {
        sum += innerMap.get(factor)!;
      }
    });
    if (sum === 0) {
      return undefined;
    }
    return sum;
  }

  calcImpulsIndex(factor: InfluencingFactor): number | undefined {
    const AS = this.getActiveSum(factor);
    const PS = this.getPassiveSum(factor);
    if (!AS || !PS) {
      return undefined;
    }
    return AS / PS;
  }

  calcDynamicIndex(factor: InfluencingFactor): number | undefined {
    const AS = this.getActiveSum(factor);
    const PS = this.getPassiveSum(factor);
    if (!AS || !PS) {
      return undefined;
    }
    return AS * PS;
  }
}
