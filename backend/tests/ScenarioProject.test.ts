import { describe } from "node:test";
import { ScenarioProject } from "../src/classes/ScenarioProject";
import { ScenarioType } from "../src/classes/ScenarioType";

describe("testing ScenarioProject class", () => {
  test("Test constructor", () => {
    let scenarioProject = new ScenarioProject("Foo", "Foo describes bar", ScenarioType.Umfeldszenario);
    expect(scenarioProject.name).toBe("Foo");
    expect(scenarioProject.description).toBe("Foo describes bar");
    expect(scenarioProject.scenarioType).toBe(ScenarioType.Umfeldszenario);
  });
});
