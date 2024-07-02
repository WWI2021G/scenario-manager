import { describe } from "node:test";
import { RawScenario } from "../src/models/RawScenario";
import { RawScenarioCatalog } from "../src/models/RawScenarioCatalog";

let rawScenario = new RawScenario("Fii", 23);
let rawScenarioCatalog = new RawScenarioCatalog(
  "Fuu",
  "Fuu catalogs scenarios for baz",
);

describe("Testing ProjectionBundleCatalog class", () => {
  test("Test constructor", () => {
    expect(rawScenarioCatalog.getName()).toBe("Fuu");
    expect(rawScenarioCatalog.getDescription()).toBe(
      "Fuu catalogs scenarios for baz",
    );
    expect(rawScenarioCatalog.getProjectionDistibution()).toStrictEqual([]);
  });

  test("Test updateName", () => {
    rawScenarioCatalog.updateName("Bar");
    expect(rawScenarioCatalog.getName()).toBe("Bar");
  });

  test("Test updateDescription", () => {
    rawScenarioCatalog.updateDescription("Bar projects baz");
    expect(rawScenarioCatalog.getDescription()).toBe("Bar projects baz");
  });

  test("Test addProjection", () => {
    rawScenarioCatalog.addProjectionDistibution(rawScenario);
    expect(rawScenarioCatalog.getProjectionDistibution()).toStrictEqual([
      rawScenario,
    ]);
  });

  test("Test removeProjection", () => {
    expect(rawScenarioCatalog.getProjectionDistibution()).toStrictEqual([
      rawScenario,
    ]);
    rawScenarioCatalog.removeProjectionDistibution(rawScenario);
    expect(rawScenarioCatalog.getProjectionDistibution()).toStrictEqual([]);
  });
});
