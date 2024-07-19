import { describe } from "node:test";
import { ProjectionBundle } from "../src/models/ProjectionBundle";
import { FutureProjection } from "../src/models/FutureProjection";
import { KeyFactor } from "../src/models/KeyFactor";
import { Probability } from "../src/models/Probability";
import { ProjectionType } from "../src/models/ProjectionType";

let projectionBundle = new ProjectionBundle(20, 4, 5);
let keyFactor = new KeyFactor("Bar", "Bar is currently like this...");
let futureProjection = new FutureProjection(
  "Fuu",
  "Fuu projects Bar",
  keyFactor,
  Probability.HIGH,
  new Date(new Date().getMonth() + 3),
  ProjectionType.TREND,
);

describe("Testing ProjectionBundle class", () => {
  test("Test constructor", () => {
    expect(projectionBundle.getConsistency()).toBe(20);
    expect(projectionBundle.getNumPartInconsistencies()).toBe(4);
    expect(projectionBundle.getPValue()).toBe(5);
    expect(projectionBundle.getProjections()).toStrictEqual([]);
  });

  test("Test setConsistency", () => {
    projectionBundle.setConsistency(24);
    expect(projectionBundle.getConsistency()).toBe(24);
  });

  test("Test setNumPartInconsistencies", () => {
    projectionBundle.setNumPartInconsistencies(6);
    expect(projectionBundle.getNumPartInconsistencies()).toBe(6);
  });

  test("Test setPValue", () => {
    projectionBundle.setPValue(2);
    expect(projectionBundle.getPValue()).toBe(2);
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

  test("Test addProjections", () => {
    projectionBundle.addProjections([futureProjection, futureProjection]);
    expect(projectionBundle.getProjections()).toStrictEqual([
      futureProjection,
      futureProjection,
    ]);
  });
});
