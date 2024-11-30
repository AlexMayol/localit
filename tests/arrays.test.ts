import { localit as store } from "../dist/index.min.esm";

describe("Saving and retrieving arrays", () => {

  const KEY = "basic";
  const VALUE = [1, "two", { three: 3 }, 4, false];

  beforeEach(() => {
    store.bust();
    store.config({ domain: "array_tests" });
    store.set(KEY, VALUE);
  });

  test("Array is stored", () => {
    expect(localStorage.length).toBe(1);
  });

  test("Array is retieved properly", () => {
    const array = store.get(KEY);
    expect(array.length).toEqual(5);
    expect(array[2]).toEqual(VALUE[2]);
  });

  test("array is not modified in memory", () => {
    const array = store.get(KEY);
    array.push(5);
    expect(array.length).toEqual(6);
    expect(store.get(KEY).length).toEqual(5);
  });
});
