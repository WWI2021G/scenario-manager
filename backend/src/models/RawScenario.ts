import { ProjectionBundle } from "./ProjectionBundle";

export class RawScenario {
  private name: string;
  private description: string;
  private projectionBundles: ProjectionBundle[];
  private quality: number;

  constructor(name: string, description: string, quality: number) {
    this.name = name;
    this.description = description;
    this.quality = quality;
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

  getQuality(): number {
    return this.quality;
  }

  updateQuality(quality: number) {
    this.quality = quality;
  }

  getProjectionBundles(): ProjectionBundle[] {
    return this.projectionBundles;
  }

  addProjectionBundle(projection: ProjectionBundle) {
    this.projectionBundles.push(projection);
  }

  removeProjectionBundle(projection: ProjectionBundle) {
    this.projectionBundles = this.projectionBundles.filter(
      (element: ProjectionBundle) => element !== projection,
    );
  }
}
