import { describe } from "node:test";
import { ProjectionBundleCatalog } from "../src/models/ProjectionBundleCatalog";
import { ProjectionBundle } from "../src/models/ProjectionBundle";

let projectionBundle = new ProjectionBundle("Faa", "Faa bundles foo");
let projectionBundleCatalog = new ProjectionBundleCatalog(
  "Boz",
  "Boz catalogs all bundles for biz",
);

describe("Testing ProjectionBundleCatalog class", () => {
  test("Test constructor", () => {
    expect(projectionBundleCatalog.getName()).toBe("Boz");
    expect(projectionBundleCatalog.getDescription()).toBe(
      "Boz catalogs all bundles for biz",
    );
    expect(projectionBundleCatalog.getProjectionBundles()).toStrictEqual([]);
  });

  test("Test updateName", () => {
    projectionBundleCatalog.updateName("Bar");
    expect(projectionBundleCatalog.getName()).toBe("Bar");
  });

  test("Test updateDescription", () => {
    projectionBundleCatalog.updateDescription("Bar projects baz");
    expect(projectionBundleCatalog.getDescription()).toBe("Bar projects baz");
  });

  test("Test addProjection", () => {
    projectionBundleCatalog.addProjectionBundle(projectionBundle);
    expect(projectionBundleCatalog.getProjectionBundles()).toStrictEqual([
      projectionBundle,
    ]);
  });

  test("Test removeProjection", () => {
    expect(projectionBundleCatalog.getProjectionBundles()).toStrictEqual([
      projectionBundle,
    ]);
    projectionBundleCatalog.removeProjectionBundle(projectionBundle);
    expect(projectionBundleCatalog.getProjectionBundles()).toStrictEqual([]);
  });
});
