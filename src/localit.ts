type LocalitConfig = {
  domain?: string;
  type?: "localStorage" | "sessionStorage";
};

let DOMAIN = "";
const EXPIRE = "_expiration_date";
let store = localStorage;

/**
 *
 * @param key - the key to retrieve
 * @returns the actual key stored in the Storage
 */
const getFullKey = (key: string): string => `${DOMAIN}${key}`;

/**
 *
 * @param key - the key to store with an expiration time
 * @param expirationTime - string with the amount of time we want to store the value. It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
 * @returns the actual key stored in the Storage
 */
const setExpiration = (key: string, expirationTime: string): void => {
  // only minutes, days, hours and seconds allowed!
  const allowedFormats = ["h", "d", "m", "s"];
  if (!allowedFormats.some((char) => expirationTime.includes(char)))
    return console.warn("Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved.");

  const expirationDate = new Date();
  let add = 0;

  if (expirationTime.includes("s")) {
    add = +expirationTime.replace("s", "");
    expirationDate.setSeconds(expirationDate.getSeconds() + add);
  }

  if (expirationTime.includes("m")) {
    add = +expirationTime.replace("m", "");
    expirationDate.setMinutes(expirationDate.getMinutes() + add);
  }

  if (expirationTime.includes("h")) {
    add = +expirationTime.replace("h", "");
    expirationDate.setHours(expirationDate.getHours() + add);
  }

  if (expirationTime.includes("d")) {
    add = +expirationTime.replace("d", "");
    expirationDate.setDate(expirationDate.getDate() + add);
  }

  store.setItem(`${getFullKey(key)}${EXPIRE}`, JSON.stringify(expirationDate));
};

const hasExpirationDate = (key: string): boolean => store.getItem(`${getFullKey(key)}${EXPIRE}`) !== null;

const hasExpired = (key: string): boolean => {
  const expirationDate: string = JSON.parse(store.getItem(`${getFullKey(key)}${EXPIRE}`) || "null");
  return new Date() > new Date(expirationDate);
};

export const localit = {
  /**
   *
   * @param domain - name of the domain that will prefix all the stored keys. Example, given a "books" domain, the key "Alone" will generate the key "books_Alone"
   * @param type - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
   */
  config({ domain = null, type = "localStorage" }: LocalitConfig): void {
    store = type === "localStorage" ? localStorage : sessionStorage;
    if (domain) DOMAIN = `${domain}_`;
    else DOMAIN = "";
  },
  /**
   * Retrieves the value associated with the given key from the Storage. It uses the current domain.
   * @param key - key that will be used to retrieve from the Storage
   * @param value - stored value in the Storage. 
   * @param expirationTime - seconds, minutes, hours or days that the value will remain stored.
      It will be deleted after that. Example: "5d" for five days or "3h" for three hours.
   */
  set(key: string, value: any, expirationTime?: string): void {
    if (!key) return console.error("Localit: provide a key to store a value");

    if (typeof value === "object") value = JSON.stringify(value);

    store.setItem(getFullKey(key), value);
    expirationTime && setExpiration(key, expirationTime);
  },
  /**
   * Retrieves the value associated with the given key from the Storage. It uses the current domain.
   * @param key - key that will be used to retrieve from the Storage
   */
  get(key: string): any {
    if (hasExpirationDate(key) && hasExpired(key)) {
      this.remove(key);
      return null;
    }
    try {
      return JSON.parse(store.getItem(getFullKey(key)));
    } catch (e) {
      return store.getItem(getFullKey(key));
    }
  },
  /**
   * Removes the given key from the Storage. It uses the current domain.
   * @param key - key that will be removed from the Storage
   */
  remove(key: string): void {
    store.removeItem(getFullKey(key));
    store.removeItem(`${getFullKey(key)}${EXPIRE}`);
  },
  /**
   * Removes all the stored values in the Storage
   * @param domain - Name of the domain that will prefix all the keys until changed again
   */
  setDomain(domain: string): void {
    DOMAIN = `${domain}_`;
  },
  /**
   * Removes all the stored values for that domain
   */
  clearDomain(domain: string = DOMAIN): void {
    for (let key of Object.keys(store)) if (key.includes(`${domain}_`)) store.removeItem(key);
  },
  /**
   * Removes all the stored values in the Storage
   */
  bust(): void {
    store.clear();
  },
};
