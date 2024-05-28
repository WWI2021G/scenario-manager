import { InfluencingFactor } from "./InfluencingFactor";
import { ScenarioType } from "./ScenarioType";

export class ScenarioProject {
  private name: string;
  private description: string;
  private influencingFactors: InfluencingFactor[];
  //private keyFactors: KeyFactor[];
  //private futureProjections: FutureProjection[];
  //private projectionBundles: ProjectionBundle[];
  private scenarioType: ScenarioType;

  constructor(name: string, description: string, scenarioType: ScenarioType) {
    this.name = name;
    this.description = description;
    this.scenarioType = scenarioType;
    this.influencingFactors = [];
    //this.keyFactors = [];
    //this.futureProjections = [];
    //this.projectionBundles = [];
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

  getScenarioType(): ScenarioType {
    return this.scenarioType;
  }

  updateScenarioType(scenarioType: ScenarioType) {
    this.scenarioType = scenarioType;
  }

  addInfluencingFactor(factor: InfluencingFactor): void {
    this.influencingFactors.push(factor);
  }

  removeInfluencingFactor(factor: InfluencingFactor): void {
    this.influencingFactors = this.influencingFactors.filter((element: InfluencingFactor) => element !== factor);
  }

  getInfluencingFactors(): InfluencingFactor[] {
    return this.influencingFactors;
  }

  // TEST: Test missing <2024-05-27> - Max
  //addKeyFactor(factor: KeyFactor): void {
  //  this.keyFactors.push(factor);
  //}
  //
  //// TEST: Test missing <2024-05-27> - Max
  //removeKeyFactor(factor: KeyFactor): void {
  //  this.keyFactors.filter((element: KeyFactor) => element !== factor);
  //}
  //
  //// TEST: Test missing <2024-05-27> - Max
  //getKeyFactors(): KeyFactor[] {
  //  return this.keyFactors;
  //}
  //
  //// TEST: Test missing <2024-05-27> - Max
  //addFutureProjection(projection: FutureProjection): void {
  //  this.futureProjections.push(projection);
  //}
  //
  //// TEST: Test missing <2024-05-27> - Max
  //removeFutureProjection(projection: FutureProjection): void {
  //  this.futureProjections.filter((element: FutureProjection) => element !== projection);
  //}
  //
  //// TEST: Test missing <2024-05-27> - Max
  //getFutureProjections(): FutureProjection[] {
  //  return this.futureProjections;
  //}
  //
  //// TEST: Test missing <2024-05-27> - Max
  //addProjectBundle(projection: ProjectBundle): void {
  //  this.projectionBundles.push(projection);
  //}
  //
  //// TEST: Test missing <2024-05-27> - Max
  //removeProjectBundle(bundle: ProjectionBundle): void {
  //  this.projectionBundles.filter((element: ProjectionBundle) => element !== bundle);
  //}
  //
  //// TEST: Test missing <2024-05-27> - Max
  //getProjectBundles(): ProjectBundle[] {
  //  return this.projectionBundles;
  //}
}
