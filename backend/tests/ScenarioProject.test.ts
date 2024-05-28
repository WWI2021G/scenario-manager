import { describe } from "node:test";
import { ScenarioProject } from "../src/models/ScenarioProject";
import { ScenarioType } from "../src/models/ScenarioType";
import { InfluencingFactor } from "../src/models/InfluencingFactor";
import { InfluencingArea } from "../src/models/InfluencingArea";
import { Variable } from "../src/models/Variable";

let scenarioProject = new ScenarioProject("Foo", "Foo describes bar", ScenarioType.Umfeldszenario);
let influencingFactor = new InfluencingFactor("Baz", "Baz factors in bar", Variable.ControlVaraible, InfluencingArea.Gesellschaft);

describe("Testing ScenarioProject class", () => {
  test("Test constructor", () => {
    expect(scenarioProject.getName()).toBe("Foo");
    expect(scenarioProject.getDescription()).toBe("Foo describes bar");
    expect(scenarioProject.getScenarioType()).toBe(ScenarioType.Umfeldszenario);
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual([]);
  });

  test("Test updateName", () => {
    scenarioProject.updateName("Bar");
    expect(scenarioProject.getName()).toBe("Bar");
  });

  test("Test updateDescription", () => {
    scenarioProject.updateDescription("Bar describes baz");
    expect(scenarioProject.getDescription()).toBe("Bar describes baz");
  });

  test("Test updateScenarioType", () => {
    scenarioProject.updateScenarioType(ScenarioType.Umfeldszenario);
    expect(scenarioProject.getScenarioType()).toBe(ScenarioType.Umfeldszenario);
  });

  test("Test adding InfluencingFactor", () => {
    scenarioProject.addInfluencingFactor(influencingFactor);
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual([influencingFactor]);
  });

  test("Test getInfluencingFactors", () => {
    let expected_values: InfluencingFactor[] = [
      influencingFactor,
    ];
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual(expected_values);
  });

  test("Test removing InfluencingFactor", () => {
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual([influencingFactor]);
    scenarioProject.removeInfluencingFactor(influencingFactor);
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual([]);
  });
});
