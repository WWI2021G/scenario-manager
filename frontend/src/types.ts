export interface KeyFactor {
  id: number;
  title: string;
  description: string;
  property: string;
  currentStateDescription: string;
  influencingArea: InfluencingArea;
}

export type InfluencMatrix = Map<string, Map<string, number>>;


export interface FutureProjection {
  id: number;
  name: string;
  mainProjection: string;
  mainProjectionDescription: string;
  alternativeProjection: string;
  alternativeProjectionDescription: string;
}

export interface ProjectionBundles {
  // Define the structure for ProjectionBundles
}

export interface ScenarioProject {
  name: string;
  description: string;
  influencingFactors: InfluencingFactor[];
  keyFactors: KeyFactor[];
  futureProjections: FutureProjection[];
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