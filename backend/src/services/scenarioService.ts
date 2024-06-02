class ScenarioService {
  name: string = "ScenarioService";

  successMessage(): string {
    return "Success";
  }
}

export const scenarioService = new ScenarioService();
