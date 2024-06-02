import { describe } from "node:test";
import { KeyFactor } from "../src/models/KeyFactor";
import { Property } from "../src/models/Property";

let keyFactor = new KeyFactor("Foo");
let propertyA = new Property("Bar", "Bar is currently looking up");
let propertyB = new Property("Baz", "Baz is currently looking down");
let propertyC = new Property("Faz", "Faz is currently looking steady");

describe("Testing KeyFactor class", () => {
  test("Test constructor", () => {
    expect(keyFactor.getName()).toBe("Foo");
    expect(keyFactor.getCritical()).toBe(false);
    expect(keyFactor.getProperties()).toStrictEqual([undefined, undefined]);
  });

  test("Test updateName", () => {
    keyFactor.updateName("Bar");
    expect(keyFactor.getName()).toBe("Bar");
  });

  test("Test updateCritical", () => {
    keyFactor.updateCritical(true);
    expect(keyFactor.getCritical()).toBe(true);
  });

  test("Test addProperty", () => {
    expect(keyFactor.getProperties()).toStrictEqual([undefined, undefined]);
    keyFactor.setProperties(propertyA, undefined);
    expect(keyFactor.getProperties()).toStrictEqual([propertyA, undefined]);
    keyFactor.setProperties(propertyA, propertyB);
    expect(keyFactor.getProperties()).toStrictEqual([propertyA, propertyB]);
  });

  test("Test updateProperty", () => {
    keyFactor.updateProperty(0, propertyC);
    expect(keyFactor.getProperties()).toStrictEqual([propertyC, propertyB]);
    keyFactor.updateProperty(1, propertyA);
    expect(keyFactor.getProperties()).toStrictEqual([propertyC, propertyA]);
    keyFactor.updateProperty(0, undefined);
    expect(keyFactor.getProperties()).toStrictEqual([undefined, propertyA]);
  });
});
