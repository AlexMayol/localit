import { localit } from "../dist/index.min.esm";
import type { Localit } from "../dist/index";

const store = localit as Localit;

describe("Saving and retrieving arrays", () => {
  const KEY = "basic";
  const VALUE = [1, "two", { three: 3 }, 4, false];

  beforeEach(() => {
    store.bust();
    store.set(KEY, VALUE, {family: "array_tests"});
  });

  test("Array is stored", () => {
    expect(localStorage.length).toBe(1);
  });

  test("Array is not retieved if family is not provided", () => {
    const array = store.get(KEY);
    expect(array).toBe(null);
  });
  test("Array is retieved properly", () => {
    const array = store.get(KEY, {family: "array_tests"});
    expect(array).toEqual(VALUE);
  });

  test("array is not modified in memory", () => {
    const array = store.get(KEY, {family: "array_tests"});
    (array as any).push(5);
    expect(array).not.toEqual(VALUE);
    expect(store.get(KEY, {family: "array_tests"})).toEqual(VALUE);
  });
});
