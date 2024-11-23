import { localit as store } from "../dist/index.min.esm";

describe("Saving and retrieving arrays", () => {
  store.config({ domain: "array_tests" });
  store.bust();

  const basicArray = {
    key: "basic",
    value: [1, "two", { three: 3 }, 4, false],
  };

  test("Array is stored", () => {
    store.set(basicArray.key, basicArray.value);
    expect(localStorage.length).toBe(1);
  });

  test("Array is retieved properly", () => {
    const array = store.get(basicArray.key);
    expect(array.length).toEqual(5);
    expect(array[2]).toEqual(basicArray.value[2]);
  });

  test("array is not modified in memory", () => {
    const array = store.get(basicArray.key);
    array.push(5);
    expect(array.length).toEqual(6);
    expect(store.get(basicArray.key).length).toEqual(5);
  });
});
