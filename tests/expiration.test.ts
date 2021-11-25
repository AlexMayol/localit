import "regenerator-runtime/runtime";
import { localit as store } from "../dist/localit.js";
const justWait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe("Saving and retrieving objects", () => {
  const domain = "expiration_tests";
  const key = "timed_value";
  const value = "A temporary string";
  const expirationTime = "10s";

  store.config({ domain });
  store.bust();

  test("Value is stored with an expiration date", () => {
    store.set(key, value, expirationTime);
    expect(localStorage.length).toBe(2);
  });

  test("Expiration date key is present in localStorage", () => {
    const finalKey = `${domain}_${key}_expiration_date`;
    const included = Object.keys(localStorage).includes(finalKey);
    expect(included).toBeTruthy();
  });

  test("Value is retrievable within its life span", () => {
    expect(store.get(key)).toEqual(value);
  });

  test("Value is no longer retrievable after the expiration date", async () => {
    jest.setTimeout(30000);
    await justWait(11000);
    expect(store.get(key)).toEqual(null);
  });

  test("localStorage is empty after the expiration date has passed", () => {
    expect(localStorage.length).toBe(0);
  });

  test("Storing multiple values with expiration date", () => {
    store.set("one", 1, "3s");
    store.set("two", 2, "6s");
    expect(localStorage.length).toBe(4);
  });

  test("After 4 seconds, only one value can be retrieved but two exists", async () => {
    await justWait(4000);
    expect(localStorage.length).toBe(4);
    expect(store.get("one")).toBeNull();
    expect(store.get("two")).toBe(2);
  });

  test("Storing bad time format", () => {
    const consoleMock = jest.spyOn(console, "warn");
    store.set("three", 3, "10ddss");
    store.set("three bad", 3, "s");

    expect(consoleMock.mock.calls.length).toBe(2);
    expect(localStorage.length).toBe(4);
  });
});
