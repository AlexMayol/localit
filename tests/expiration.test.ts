import wait from "waait";
import "regenerator-runtime/runtime";
import { localit as store } from "../dist/localit";

describe("Saving and retrieving objects", () => {
  const domain = "expiration_tests";
  const key = "timed_value";
  const value = "A temporary string";
  const expirationTime = "10s";
  store.config({ domain });
  store.bust();

  test("value is stored with expiration date", () => {
    store.set(key, value, expirationTime);
    expect(localStorage.length).toBe(2);
  });
  test("expiration date key is present in localStorage", () => {
    const finalKey = `${domain}_${key}_expiration_date`;
    const included = Object.keys(localStorage).includes(finalKey);
    expect(included).toBeTruthy();
  });
  test("value is retrievable within its life span", () => {
    expect(store.get(key)).toEqual(value);
  });
  test("value is no longer retrievable after the expiration date", async () => {
    jest.setTimeout(30000);
    await wait(11000);
    expect(store.get(key)).toEqual(null);
  });
  test("localStorage is empty after the expiration date has passed", () => {
    expect(localStorage.length).toBe(0);
  });
});
