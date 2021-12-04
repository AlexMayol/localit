import { localit as store } from "../dist/localit";

describe("Listener Events", () => {
  const key = "listener";
  const value = "d_ listener";
  const domain = "event_listener_test";
  store.config({ domain });
  const mockCallback = jest.fn();
  store.on(`${domain}_${key}`, mockCallback);

  beforeEach(() => {
    mockCallback.mockClear();
  });

  test("Callback is executed on set", () => {
    store.set(key, value);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledWith(
      expect.objectContaining({
        value,
      })
    );
  });
  test("Callback is executed on set twice", () => {
    const updateValue = "updatedValue";
    store.set(key, updateValue);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledWith(
      expect.objectContaining({
        value: updateValue,
      })
    );
  });
  test("Callback is executed on remove", () => {
    store.remove(key);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledWith(null);
  });
  test("Callback is executed on getAndRemove", () => {
    store.set(key, value);
    store.getAndRemove(key);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledTimes(2);
    expect(mockCallback).toBeCalledWith(null);
  });
  test("Callback is executed on bust", () => {
    store.set(key, value);
    store.bust();
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledWith(null);
  });
  test("Callback is executed on clearDomain", () => {
    store.set(key, value);
    store.clearDomain();
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledWith(null);
  });
});
