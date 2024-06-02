import { FutureProjection } from "./FutureProjection";
import { InfluencingFactor } from "./InfluencingFactor";
import { KeyFactor } from "./KeyFactor";
import { ProjectionBundle } from "./ProjectionBundle";
import { ScenarioType } from "./ScenarioType";

export class ScenarioProject {
  private name: string;
  private description: string;
  private influencingFactors: InfluencingFactor[];
  private keyFactors: KeyFactor[];
  private futureProjections: FutureProjection[];
  private projectionBundles: ProjectionBundle[];
  private scenarioType: ScenarioType;

  constructor(name: string, description: string, scenarioType: ScenarioType) {
    this.name = name;
    this.description = description;
    this.scenarioType = scenarioType;
    this.influencingFactors = [];
    this.keyFactors = [];
    this.futureProjections = [];
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
    this.influencingFactors = this.influencingFactors.filter(
      (element: InfluencingFactor) => element !== factor,
    );
  }

  getInfluencingFactors(): InfluencingFactor[] {
    return this.influencingFactors;
  }

  addKeyFactor(factor: KeyFactor): void {
    this.keyFactors.push(factor);
  }

  removeKeyFactor(factor: KeyFactor): void {
    this.keyFactors = this.keyFactors.filter(
      (element: KeyFactor) => element !== factor,
    );
  }

  getKeyFactors(): KeyFactor[] {
    return this.keyFactors;
  }

  addFutureProjection(projection: FutureProjection): void {
    this.futureProjections.push(projection);
  }

  removeFutureProjection(projection: FutureProjection): void {
    this.futureProjections = this.futureProjections.filter(
      (element: FutureProjection) => element !== projection,
    );
  }

  getFutureProjections(): FutureProjection[] {
    return this.futureProjections;
  }

  addProjectionBundle(projection: ProjectionBundle): void {
    this.projectionBundles.push(projection);
  }

  removeProjectionBundle(bundle: ProjectionBundle): void {
    this.projectionBundles = this.projectionBundles.filter(
      (element: ProjectionBundle) => element !== bundle,
    );
  }

  getProjectionBundles(): ProjectionBundle[] {
    return this.projectionBundles;
  }
}
