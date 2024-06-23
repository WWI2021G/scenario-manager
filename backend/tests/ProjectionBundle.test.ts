import { describe } from "node:test";
import { ProjectionBundle } from "../src/models/ProjectionBundle";
import { FutureProjection } from "../src/models/FutureProjection";
import { KeyFactor } from "../src/models/KeyFactor";
import { Probability } from "../src/models/Probability";
import { ProjectionType } from "../src/models/ProjectionType";

let projectionBundle = new ProjectionBundle("Buz", "Buz bundles Projections");
let keyFactor = new KeyFactor("Bar", "Bar is currently like this...");
let futureProjection = new FutureProjection(
  "Fuu",
  "Fuu projects Bar",
  keyFactor,
  Probability.high,
  new Date(new Date().getMonth() + 3),
  ProjectionType.Trend,
);

describe("Testing ProjectionBundle class", () => {
  test("Test constructor", () => {
    expect(projectionBundle.getName()).toBe("Buz");
    expect(projectionBundle.getDescription()).toBe("Buz bundles Projections");
    expect(projectionBundle.getProjections()).toStrictEqual([]);
  });

  test("Test updateName", () => {
    projectionBundle.updateName("Bar");
    expect(projectionBundle.getName()).toBe("Bar");
  });

  test("Test updateDescription", () => {
    projectionBundle.updateDescription("Bar bundles Projections");
    expect(projectionBundle.getDescription()).toBe("Bar bundles Projections");
  });

  test("Test addProjection", () => {
    projectionBundle.addProjection(futureProjection);
    expect(projectionBundle.getProjections()).toStrictEqual([futureProjection]);
  });

  test("Test removeProjection", () => {
    expect(projectionBundle.getProjections()).toStrictEqual([futureProjection]);
    projectionBundle.removeProjection(futureProjection);
    expect(projectionBundle.getProjections()).toStrictEqual([]);
  });
});
