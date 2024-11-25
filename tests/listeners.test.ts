import { localit as store } from "../dist/index.min.esm";

describe("Listener Events", () => {
  const key = "listener";
  const value = "d_ listener";
  const domain = "event_listener_test";
  store.config({ domain });

  const mockCallback = jest.fn();
  store.on(key, mockCallback);

  beforeEach(() => {
    mockCallback.mockClear();
  });

  test("Callback is executed on set", () => {
    store.set(key, value);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledWith(value);
  });
  test("Callback is executed on set twice", () => {
    const updateValue = "updatedValue";
    store.set(key, updateValue);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toBeCalledWith(updateValue);
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
