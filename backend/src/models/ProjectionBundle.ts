import { FutureProjection } from "./FutureProjection";

export class ProjectionBundle {
  private name: string;
  private description: string;
  private projections: FutureProjection[];

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.projections = [];
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string) {
    this.name = name;
  }

  getDescription(): string {
    return this.description;
  }

  updateDescription(description: string) {
    this.description = description;
  }

  getProjections(): FutureProjection[] {
    return this.projections;
  }

  addProjection(projection: FutureProjection) {
    this.projections.push(projection);
  }

  removeProjection(projection: FutureProjection) {
    this.projections = this.projections.filter((element: FutureProjection) => element !== projection);
  }
}
