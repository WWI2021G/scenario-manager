export interface InfluencingFactor {
  id: number;
  name: string;
  description: string;
  variable: string;
  influencingAreas: string;
}

export interface InfluencingFactor {
  id: number;
  name: string;
  description: string;
  variable: string;
  influencingAreas: string;
}

export interface KeyFactor {
  // Define the structure for KeyFactor
}

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
