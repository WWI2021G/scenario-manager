import { FutureProjection } from "./FutureProjection";

export class ProjectionBundle {
  private projections: FutureProjection[];
  private consistency: number;
  private numPartInconsistencies: number;
  private pValue: number;
  private probability: number;

  constructor(
    consistency: number,
    numPartInconsistencies: number,
    probability: number,
  ) {
    this.projections = [];
    this.consistency = consistency;
    this.numPartInconsistencies = numPartInconsistencies;
    this.probability = probability;
    this.pValue = 0;
  }

  getProjections(): FutureProjection[] {
    return this.projections;
  }

  addProjection(projection: FutureProjection) {
    this.projections.push(projection);
  }

  addProjections(projections: FutureProjection[]) {
    this.projections = this.projections.concat(projections);
  }

  removeProjection(projection: FutureProjection) {
    this.projections = this.projections.filter(
      (element: FutureProjection) => element !== projection,
    );
  }

  getConsistency(): number {
    return this.consistency;
  }

  setConsistency(consistency: number) {
    this.consistency = consistency;
  }

  getNumPartInconsistencies(): number {
    return this.numPartInconsistencies;
  }

  setNumPartInconsistencies(numPartInconsistencies: number) {
    this.numPartInconsistencies = numPartInconsistencies;
  }

  getProbability(): number {
    return this.probability;
  }

  setProbability(probability: number) {
    this.probability = probability;
  }

  getPValue(): number {
    return this.pValue;
  }

  setPValue(pValue: number) {
    this.pValue = pValue;
  }
}
