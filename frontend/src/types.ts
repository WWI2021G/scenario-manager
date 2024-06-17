export interface KeyFactor {
  id: number;
  name: string;
}

export type InfluencMatrix = Map<string, Map<string, number>>;


export interface FutureProjections {
  // Define the structure for FutureProjections
}

export interface ProjectionBundles {
  // Define the structure for ProjectionBundles
}

export interface ScenarioProject {
  name: string;
  description: string;
  influencingFactors: InfluencingFactor[];
  keyFactors: KeyFactor[];
  futureProjections: FutureProjections[];
  projectionBundles: ProjectionBundles[];
  scenarioType: string; // Assuming ScenarioType is a string for simplicity
}

export enum InfluencingArea {
  Handel = "Handel",
  Informationstechnologie = "Informationstechnologie",
  Oekonomie = "Oekonomie",
  Gesellschaft = "Gesellschaft",
}

export interface InfluencingFactor {
  id: number;
  name: string;
  description: string;
  variable: string;
  influencingArea: InfluencingArea;
}