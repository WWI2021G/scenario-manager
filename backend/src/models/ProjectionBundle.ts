import { FutureProjection } from "./FutureProjection";

export class ProjectionBundle {
  private projections: FutureProjection[];
  private consistency: number;
  private numPartInconsistencies: number;
  private pValue: number;

  constructor(
    consistency: number,
    numPartInconsistencies: number,
    pValue: number,
  ) {
    this.projections = [];
    this.consistency = consistency;
    this.numPartInconsistencies = numPartInconsistencies;
    this.pValue = pValue;
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

  getPValue(): number {
    return this.pValue;
  }

  setPValue(pValue: number) {
    this.pValue = pValue;
  }
}
