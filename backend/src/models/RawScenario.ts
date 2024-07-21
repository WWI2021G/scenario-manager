import { ProjectionBundle } from "./ProjectionBundle";

export class RawScenario {
  private name: string;
  private projectionBundles: ProjectionBundle[];
  private quality: number;


  constructor(name: string, quality: number) {
    this.name = name;
    this.quality = quality;
    this.projectionBundles = [];
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string) {
    this.name = name;
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
