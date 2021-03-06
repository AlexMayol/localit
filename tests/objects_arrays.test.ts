import { localit as store } from "../dist/localit";

describe("Saving and retrieving objects", () => {
  store.config({ domain: "object_tests" });
  store.bust();
  const key = "cool_object";
  const value = {
    js: true,
    ts: true,
    css: ["display", "font-size"],
    html: {
      div: true,
      span: false,
    },
  };
  test("object is stored", () => {
    store.set(key, value);
    expect(localStorage.length).toBe(1);
  });
  test("array is encoded properly", () => {
    const { css } = store.get(key);
    expect(css).toEqual(value.css);
  });
  test("object is encoded properly", () => {
    const { html } = store.get(key);
    expect(html.div).toBeTruthy();
    expect(html.span).toBeFalsy();
  });
});
