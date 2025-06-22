import { localit as store } from "../dist/index.min.esm";
import { justWait } from "./expiration.test";

describe("localit - Complex Map and Set handling", () => {
  beforeEach(() => {
    store.bust();
  });

  it("should correctly store and retrieve a complex Map", () => {
    const testKey = "complexMap";
    const complexMap = new Map([
      ["key1", { name: "Alice", age: 30 }],
      ["key2", [1, 2, 3, 4]],
      ["key3", "simpleValue"],
    ]);

    store.set(testKey, complexMap);

    const retrievedMap = store.get(testKey);

    expect(retrievedMap).toBeInstanceOf(Map);
    expect(retrievedMap.size).toBe(3);
    expect(retrievedMap.get("key1")).toEqual(complexMap.get("key1"));
    expect(retrievedMap.get("key2")).toEqual(complexMap.get("key2"));
    expect(retrievedMap.get("key3")).toBe(complexMap.get("key3"));
  });

  it("should correctly store and retrieve a complex Set", () => {
    const testKey = "complexSet";
    const complexSet = new Set([
      { id: 1, value: "object1" },
      ["nested", "array", 42],
      "simpleValue",
    ]);

    store.set(testKey, complexSet);

    const retrievedSet = store.get(testKey);

    expect(retrievedSet).toBeInstanceOf(Set);
    expect(retrievedSet.size).toBe(3);

    const items = Array.from(retrievedSet);
    expect(items).toContainEqual({ id: 1, value: "object1" });
    expect(items).toContainEqual(["nested", "array", 42]);
    expect(items).toContain("simpleValue");
  });

  it("should handle expiration for a complex Map", async () => {
    const testKey = "complexMapExpires";
    const complexMap = new Map([
      ["key1", { name: "Bob", age: 25 }],
      ["key2", [5, 6, 7, 8]],
    ]);

    store.set(testKey, complexMap, "1s");

    await justWait(2000); // Simulate 2 seconds

    const retrievedMap = store.get(testKey);

    expect(retrievedMap).toBeNull();
  });

  it("should handle expiration for a complex Set", async () => {
    const testKey = "complexSetExpires";
    const complexSet = new Set([
      { id: 2, value: "object2" },
      ["another", "nested", "array"],
      "anotherSimpleValue",
    ]);

    store.set(testKey, complexSet, "1s");

    await justWait(2000); // Simulate 2 seconds

    const retrievedSet = store.get(testKey);

    expect(retrievedSet).toBeNull();
  });
});
