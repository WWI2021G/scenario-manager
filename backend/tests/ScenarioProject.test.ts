import { describe } from "node:test";
import { ScenarioProject } from "../src/classes/ScenarioProject";
import { ScenarioType } from "../src/classes/ScenarioType";
import { InfluencingFactor } from "../src/classes/InfluencingFactor";
import { InfluencingArea } from "../src/classes/InfluencingArea";

let scenarioProject = new ScenarioProject("Foo", "Foo describes bar", ScenarioType.Umfeldszenario);
let influencingFactor = new InfluencingFactor("Baz", "Baz factors in bar", "Details go here", InfluencingArea.Gesellschaft);

describe("Testing ScenarioProject class", () => {
  test("Test constructor", () => {
    expect(scenarioProject.name).toBe("Foo");
    expect(scenarioProject.description).toBe("Foo describes bar");
    expect(scenarioProject.scenarioType).toBe(ScenarioType.Umfeldszenario);
    expect(scenarioProject.influencingFactors).toStrictEqual([]);
  });
});

describe("Testing ScenarioProject class", () => {
  test("Test adding InfluencingFactor", () => {
    scenarioProject.addInfluencingFactor(influencingFactor);
    expect(scenarioProject.influencingFactors).toStrictEqual([influencingFactor]);
  });
});

describe("Testing ScenarioProject class", () => {
  test("Test getInfluencingFactors", () => {
    let expected_values: InfluencingFactor[] = [
      influencingFactor,
    ];
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual(expected_values);
  });
});

describe("Testing ScenarioProject class", () => {
  test("Test removing InfluencingFactor", () => {
    expect(scenarioProject.influencingFactors).toStrictEqual([influencingFactor]);
    scenarioProject.removeInfluencingFactor(influencingFactor);
    expect(scenarioProject.influencingFactors).toStrictEqual([]);
  });
});
