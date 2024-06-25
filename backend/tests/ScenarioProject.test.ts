import { describe } from "node:test";
import { ScenarioProject } from "../src/models/ScenarioProject";
import { ScenarioType } from "../src/models/ScenarioType";
import { InfluencingFactor } from "../src/models/InfluencingFactor";
import { KeyFactor } from "../src/models/KeyFactor";
import { FutureProjection } from "../src/models/FutureProjection";
import { Probability } from "../src/models/Probability";
import { ProjectionType } from "../src/models/ProjectionType";
import { ProjectionBundle } from "../src/models/ProjectionBundle";
import { User } from "../src/models/User";

let scenarioProject = new ScenarioProject(
  "Foo",
  "Foo describes bar",
  ScenarioType.Umfeldszenario,
  new User("Test", "testpw"),
);
let influencingFactor = new InfluencingFactor(
  "Baz",
  "Baz factors in bar",
);
const keyFactor = new KeyFactor("Bar", "Bar is currently like this...");
let futureProjection = new FutureProjection(
  "Fuu",
  "Fuu projects Bar",
  keyFactor,
  Probability.high,
  new Date(new Date().getMonth() + 3),
  ProjectionType.Trend,
);
let projectionBundle = new ProjectionBundle("Biz", "Biz bundles Bar and Bir");

describe("Testing ScenarioProject class", () => {
  test("Test constructor", () => {
    expect(scenarioProject.getName()).toBe("Foo");
    expect(scenarioProject.getDescription()).toBe("Foo describes bar");
    expect(scenarioProject.getScenarioType()).toBe(ScenarioType.Umfeldszenario);
    expect(scenarioProject.getUser()).toStrictEqual(new User("Test", "testpw"));
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual([]);
    expect(scenarioProject.getKeyFactors()).toStrictEqual([]);
    expect(scenarioProject.getFutureProjections()).toStrictEqual([]);
    expect(scenarioProject.getProjectionBundles()).toStrictEqual([]);
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
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual([
      influencingFactor,
    ]);
  });

  test("Test removing InfluencingFactor", () => {
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual([
      influencingFactor,
    ]);
    scenarioProject.removeInfluencingFactor(influencingFactor);
    expect(scenarioProject.getInfluencingFactors()).toStrictEqual([]);
  });

  test("Test adding KeyFactor", () => {
    scenarioProject.addKeyFactor(keyFactor);
    expect(scenarioProject.getKeyFactors()).toStrictEqual([keyFactor]);
  });

  test("Test removing KeyFactor", () => {
    expect(scenarioProject.getKeyFactors()).toStrictEqual([keyFactor]);
    scenarioProject.removeKeyFactor(keyFactor);
    expect(scenarioProject.getKeyFactors()).toStrictEqual([]);
  });

  test("Test adding FutureProjection", () => {
    scenarioProject.addFutureProjection(futureProjection);
    expect(scenarioProject.getFutureProjections()).toStrictEqual([
      futureProjection,
    ]);
  });

  test("Test removing FutureProjection", () => {
    expect(scenarioProject.getFutureProjections()).toStrictEqual([
      futureProjection,
    ]);
    scenarioProject.removeFutureProjection(futureProjection);
    expect(scenarioProject.getFutureProjections()).toStrictEqual([]);
  });

  test("Test adding ProjectionBundle", () => {
    scenarioProject.addProjectionBundle(projectionBundle);
    expect(scenarioProject.getProjectionBundles()).toStrictEqual([
      projectionBundle,
    ]);
  });

  test("Test removing ProjectionBundle", () => {
    expect(scenarioProject.getProjectionBundles()).toStrictEqual([
      projectionBundle,
    ]);
    scenarioProject.removeProjectionBundle(projectionBundle);
    expect(scenarioProject.getProjectionBundles()).toStrictEqual([]);
  });
});
