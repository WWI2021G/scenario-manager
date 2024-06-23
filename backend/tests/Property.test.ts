import { describe } from "node:test";
import { Property } from "../src/models/Property";

let property = new Property("Bar");

describe("Testing Property class", () => {
  test("Test constructor", () => {
    expect(property.getName()).toBe("Bar");
  });

  test("Test updateName", () => {
    property.updateName("Bar");
    expect(property.getName()).toBe("Bar");
  });
});
