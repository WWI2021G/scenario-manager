export class ScenarioProject {
  name: string;
  description: string;
  scenarioType: ScenarioType;

  constructor(name: string, description: string, scenarioType: ScenarioType) {
    this.name = name;
    this.description = description;
    this.scenarioType = scenarioType;
  }

  // TEST: Was genau soll es zurückgeben? Name und Beschreibung? <2024-05-27> - Max
  getDetails(): string { return this.name + "\n" + this.description }
}
