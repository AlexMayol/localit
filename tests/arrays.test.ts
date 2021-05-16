import { localit as store } from "../dist/localit";

describe("Saving and retrieving arrays", () => {
  store.config({ domain: "array_tests" });
  store.bust();

  const key = "cool_array";
  const value = [1, "two", { three: 3 }, 4, false];

  test("array is stored", () => {
    store.set(key, value);
    expect(localStorage.length).toBe(1);
  });
  test("array is retieved properly", () => {
    const array = store.get(key);
    expect(array.length).toEqual(5);
  });
  test("array is not modified in memory", () => {
    const array = store.get(key);
    array.push(5);
    expect(array.length).toEqual(6);
    expect(store.get(key).length).toEqual(5);
  });
});
