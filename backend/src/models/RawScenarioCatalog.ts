// TEST: Add tests <2024-05-30> - Max
export class RawScenarioCatalog {
  name: string;
  bundleDescription: string;
  projectionDistribution: number[];

  constructor(name: string, bundleDescription: string) {
    this.name = name;
    this.bundleDescription = bundleDescription;
    this.projectionDistribution = [];
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string) {
    this.name = name;
  }

  getBundleDescription(): string {
    return this.bundleDescription;
  }

  updateBundleDescription(description: string) {
    this.bundleDescription = description;
  }

  getProjectionDistibution(): number[] {
    return this.projectionDistribution;
  }

  addProjectionDistibution(projectionDistribution: number) {
    this.projectionDistribution.push(projectionDistribution);
  }

  removeProjectionDistibution(projectionDistribution: number) {
    this.projectionDistribution = this.projectionDistribution.filter((element: number) => element !== projectionDistribution);
  }
}
