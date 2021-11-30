type LocalitConfig = {
  domain?: string;
  type?: "localStorage" | "sessionStorage";
};

let DOMAIN = "";
const EXPIRE = "_expiration_date";
let store: Storage = localStorage;

class EventEmitter {
  private listeners: any;

  constructor() {
    this.listeners = {};
    this.on.bind(this);
    this.emit.bind(this);
  }

  on(event: string, callback: (value: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  emit(event: string, ...data: any) {
    if (!this.listeners[event]) {
      return null;
    }

    for (let i = 0; i < this.listeners[event].length; i++) {
      const callback = this.listeners[event][i];

      callback.call(this, ...data);
    }
  }

  clear() {
    Object.keys(this.listeners).map((event) => {
      this.emit(event, null);
    });
  }
}

const eventEmitter = new EventEmitter();

/**
 * @param key - the unprefixed key to retrieve
 * @returns the actual key stored in Storage
 */
const getFullKey = (key: string): string => `${DOMAIN}${key}`;

/**
 * @param key - the unprefixed key to save with an expiration time
 * @returns the actual key stored in the Storage
 */
const getExpirationKey = (key: string): string => `${getFullKey(key)}${EXPIRE}`;

/**
 * @param key - the key to store with an expiration time
 * @param expirationTime - string with the amount of time we want to store the value. It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
 */
const setExpiration = (key: string, expirationTime: string): void => {
  const expirationDate = new Date();

  const timeFormats = {
    h: (time: number) =>
      expirationDate.setHours(expirationDate.getHours() + time),
    d: (time: number) =>
      expirationDate.setDate(expirationDate.getDate() + time),
    m: (time: number) =>
      expirationDate.setMinutes(expirationDate.getMinutes() + time),
    s: (time: number) =>
      expirationDate.setSeconds(expirationDate.getSeconds() + time)
  };
  // only minutes, days, hours and seconds allowed!
  const allowedFormats = Object.keys(timeFormats);
  const timeKey = expirationTime[expirationTime.length - 1];
  const time = Number(expirationTime.replace(timeKey, ""));
  if (
    expirationTime.length < 2 ||
    !allowedFormats.some((char) => timeKey === char) ||
    isNaN(time)
  )
    return console.warn(
      "Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved."
    );

  store.setItem(
    getExpirationKey(key),
    JSON.stringify(timeFormats[timeKey](time))
  );
};

/**
 * @param key - the key to check if it has an expiration date
 * @return whether or not there is an expiration date for the given key
 */
const hasExpirationDate = (key: string): boolean =>
  store.getItem(getExpirationKey(key)) !== null;

/**
 * @param key - the key to check if it has expired
 * @return whether or not there is an expiration date for the given key
 */
const hasExpired = (key: string): boolean => {
  const expirationDate: string = JSON.parse(
    store.getItem(getExpirationKey(key))
  );
  return new Date() > new Date(expirationDate);
};

export const localit = {
  /**
   * Sets the default configuration for storing data.
   * @param domain - name of the domain that will prefix all the stored keys. Example: given a "books" domain, the key "alone" will be stored as "books_alone".
   * @param type - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
   */
  config({ domain = null, type = "localStorage" }: LocalitConfig): void {
    store = type === "localStorage" ? localStorage : sessionStorage;
    if (domain) DOMAIN = `${domain}_`;
    else DOMAIN = "";
  },
  /**
   * Stores the given key/value in Storage. Additionally, an expiration date can be set.
   * @param key - key to store in Storage
   * @param value - value to store in Storage. 
   * @param expirationTime - seconds, minutes, hours or days that the value will remain stored.
      It will be deleted after that.
      It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
      Example: "5d" for five days or "3h" for three hours.
   */
  set(key: string, value: any, expirationTime?: string): void {
    if (!key) return console.error("Localit: provide a key to store the value");

    if (typeof value === "object") value = JSON.stringify(value);

    store.setItem(getFullKey(key), value);
    expirationTime && setExpiration(key, expirationTime);
    eventEmitter.emit(getFullKey(key), value);
  },
  /**
   * Retrieves the value associated with the given key from the Storage. It uses the current domain.
   * @param key - key that will be used to retrieve from Storage
   */
  get(key: string): any {
    if (hasExpirationDate(key) && hasExpired(key)) {
      this.remove(key);
      return null;
    }
    try {
      return JSON.parse(store.getItem(getFullKey(key)));
    } catch (_) {
      return store.getItem(getFullKey(key));
    }
  },
  /**
   * Removes the given key from the Storage (and it's associated expiration date, if set). It uses the current domain.
   * @param key - key that will be removed from the Storage
   */
  remove(key: string): void {
    store.removeItem(getFullKey(key));
    store.removeItem(getExpirationKey(key));
    eventEmitter.emit(getFullKey(key), null);
  },
  /**
   * Retrieves the value associated with the given key from the Storage and then removes it. It uses the current domain.
   * @param key - Key to get the value of and then remove from Storage. It uses the current domain.
   *
   */
  getAndRemove(key: string): any {
    const res = this.get(key);
    this.remove(key);
    eventEmitter.emit(getFullKey(key), null);
    return res;
  },
  /**
   * Sets a new domain to prefix the next stored keys
   * @param domain - Name of the domain that will prefix all the keys until changed again
   */
  setDomain(domain: string): void {
    DOMAIN = `${domain}_`;
  },
  /**
   * Removes all the stored values for that domain. Defaults to the current domain.
   * @param domain - Name of the domain we want to remove
   */
  clearDomain(domain: string = DOMAIN): void {
    for (const key of Object.keys(store))
      if (key.includes(`${domain}_`)) {
        store.removeItem(key);
        eventEmitter.emit(key, null);
      }
  },
  /**
   * Removes all the stored values in Storage
   */
  bust(): void {
    store.clear();
    eventEmitter.clear();
  },
  onChange(key: string, callback: (value: any) => void) {
    eventEmitter.on(key, callback);
  }
};

export type TLocalit = typeof localit;
