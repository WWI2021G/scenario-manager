import { RawScenario } from "./RawScenario";

export class RawScenarioCatalog {
  name: string;
  Description: string;
  projectionDistribution: RawScenario[];

  constructor(name: string, bundleDescription: string) {
    this.name = name;
    this.Description = bundleDescription;
    this.projectionDistribution = [];
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string) {
    this.name = name;
  }

  getDescription(): string {
    return this.Description;
  }

  updateDescription(description: string) {
    this.Description = description;
  }

  getProjectionDistibution(): RawScenario[] {
    return this.projectionDistribution;
  }

  addProjectionDistibution(projectionDistribution: RawScenario) {
    this.projectionDistribution.push(projectionDistribution);
  }

  removeProjectionDistibution(projectionDistribution: RawScenario) {
    this.projectionDistribution = this.projectionDistribution.filter((element: RawScenario) => element !== projectionDistribution);
  }
}
