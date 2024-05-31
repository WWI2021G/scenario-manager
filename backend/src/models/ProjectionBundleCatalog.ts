import { ProjectionBundle } from "./ProjectionBundle";

export class ProjectionBundleCatalog {
  private name: string;
  private description: string;
  private projectionBundles: ProjectionBundle[];

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.projectionBundles = [];
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

  getProjectionBundles(): ProjectionBundle[] {
    return this.projectionBundles;
  }

  addProjectionBundle(projection: ProjectionBundle) {
    this.projectionBundles.push(projection);
  }

  removeProjectionBundle(projection: ProjectionBundle) {
    this.projectionBundles = this.projectionBundles.filter((element: ProjectionBundle) => element !== projection);
  }
}
