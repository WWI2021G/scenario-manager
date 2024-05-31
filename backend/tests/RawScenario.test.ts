import { describe } from "node:test";
import { RawScenario } from "../src/models/RawScenario";
import { ProjectionBundle } from "../src/models/ProjectionBundle";

let projectionBundle = new ProjectionBundle("Buz", "Buz bundles Projections");
let rawScenario = new RawScenario("Fii", "Fii is a scenario for baz", 23);

describe("Testing ProjectionBundle class", () => {
  test("Test constructor", () => {
    expect(rawScenario.getName()).toBe("Fii");
    expect(rawScenario.getDescription()).toBe("Fii is a scenario for baz");
    expect(rawScenario.getProjectionBundles()).toStrictEqual([]);
    expect(rawScenario.getQuality()).toBe(23);
  });

  test("Test updateName", () => {
    rawScenario.updateName("Bar");
    expect(rawScenario.getName()).toBe("Bar");
  });

  test("Test updateDescription", () => {
    rawScenario.updateDescription("Bar projects baz");
    expect(rawScenario.getDescription()).toBe("Bar projects baz");
  });

  test("Test updateQuality", () => {
    rawScenario.updateQuality(13);
    expect(rawScenario.getQuality()).toBe(13);
  });

  test("Test addProjectionBundle", () => {
    rawScenario.addProjectionBundle(projectionBundle);
    expect(rawScenario.getProjectionBundles()).toStrictEqual([projectionBundle]);
  });

  test("Test removeProjectionBundle", () => {
    expect(rawScenario.getProjectionBundles()).toStrictEqual([projectionBundle]);
    rawScenario.removeProjectionBundle(projectionBundle);
    expect(rawScenario.getProjectionBundles()).toStrictEqual([]);
  });
});
