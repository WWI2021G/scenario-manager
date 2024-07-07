export enum Probability {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ProjectionType {
  TREND = 'TREND',
  EXTREME = 'EXTREME',
}

export enum ScenarioType {
  Umfeldszenario = "Umfeldszenario",
  LangfristigesUmfeldszenario = "LangfristigesUmfeldszenario",
  KurzfristigesUmfeldszenario = "KurzfristigesUmfeldszenario",
  Systemszenario = "Systemszenario",
  RisikomeidendesSystemszenario = "RisikomeidendesSystemszenario",
  RisikosuchendesSystemszenario = "RisikosuchendesSystemszenario",
}

export interface KeyFactor {
  id: number;
  name: string;
  prop_one: string;
  prop_two: string;
  curState: string;
  projectionA: FutureProjection | undefined;
  projectionB: FutureProjection | undefined;
}

export type InfluencMatrix = Map<string, Map<string, number>>;


export interface FutureProjection {
  name: string;
  keyFactor: KeyFactor;
  description: string;
  projectionType: ProjectionType;
  probability: Probability;
}

export interface ProjectionBundle {
  id: number;
  name: string;
  description: string;
  projections: FutureProjection[];
  numberOfPartialInconsistencies: number;
  pValue: number;
  probability: number;
}

export interface ScenarioProject {
  name: string;
  description: string;
  influencingFactors: InfluencingFactor[];
  keyFactors: KeyFactor[];
  futureProjections: FutureProjection[];
  projectionBundles: ProjectionBundle[];
  scenarioType: ScenarioType;
}


export interface InfluencingFactor {
  name: string;
  description: string;
}

type Quality = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface RawScenario {
  name: string;
  description: string;
  projectionBundles: ProjectionBundle[];
  quality: Quality;
}

export interface User {
  id: number;
  username: string;
  password: string;
}
