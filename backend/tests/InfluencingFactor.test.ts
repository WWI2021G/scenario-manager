import { describe } from "node:test";
import { InfluencingArea } from "../src/classes/InfluencingArea";
import { InfluencingFactor } from "../src/classes/InfluencingFactor";

describe("Testing InfluencingFactor class", () => {
  test("Test constructor", () => {
    let influencingFactor = new InfluencingFactor("Baz", "Baz factors in bar", "Details go here", InfluencingArea.Gesellschaft);
    expect(influencingFactor.name).toBe("Baz");
    expect(influencingFactor.description).toBe("Baz factors in bar");
    expect(influencingFactor.details).toBe("Details go here");
    expect(influencingFactor.influencingArea).toBe(InfluencingArea.Gesellschaft);
  });
});
