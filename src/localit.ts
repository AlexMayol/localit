// https://www.tsmean.com/articles/how-to-write-a-typescript-library/
// https://www.tsmean.com/articles/how-to-write-a-typescript-library/local-consumer/

let DOMAIN: string = "";
let EXPIRE: string = "_expiration_date";
let store: Storage = localStorage;

const getFullKey = (key: string) => {
  return `${DOMAIN}${key}`;
};

const setExpiration = (key: string, expiration_time: string) => {
  // only minutes, days, hours and seconds allowed!
  const allowedFormats = ["h", "d", "m", "s"];
  if (!allowedFormats.some((char) => expiration_time.includes(char)))
    return console.warn(`Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved.`);

  let expiration_date = new Date();
  let add: number = null;

  if (expiration_time.includes("s")) {
    add = +expiration_time.replace("s", "");
    expiration_date.setSeconds(expiration_date.getSeconds() + add);
  }

  if (expiration_time.includes("m")) {
    add = +expiration_time.replace("m", "");
    expiration_date.setMinutes(expiration_date.getMinutes() + add);
  }

  if (expiration_time.includes("h")) {
    add = +expiration_time.replace("h", "");
    expiration_date.setHours(expiration_date.getHours() + add);
  }

  if (expiration_time.includes("d")) {
    add = +expiration_time.replace("d", "");
    expiration_date.setDate(expiration_date.getDate() + add);
  }

  store.setItem(`${getFullKey(key)}${EXPIRE}`, JSON.stringify(expiration_date));
};

const hasExpirationDate = (key: string) => {
  return store.getItem(`${getFullKey(key)}${EXPIRE}`) !== null;
};

const hasExpired = (key: string) => {
  let expirationDate: string = JSON.parse(store.getItem(`${getFullKey(key)}${EXPIRE}`));
  return new Date() > new Date(expirationDate);
};

export const localit = {
  config({ type = "localStorage", domain = DOMAIN }: { type: string; domain: string }) {
    store = type === "localStorage" ? localStorage : sessionStorage;
    // K ACEMOS CON ESTOO SI '' ¿
    if (domain !== "") DOMAIN = `${domain}_`;
    else DOMAIN = domain;
  },
  set(key: string, value: any, expiration_time: string = null) {
    if (!key) return console.error("Localit: provide a key to store a value");

    if (typeof value == "object") value = JSON.stringify(value);

    store.setItem(getFullKey(key), value);
    expiration_time && setExpiration(key, expiration_time);
  },
  get(key: string) {
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
  remove(key: string) {
    store.removeItem(getFullKey(key));
    store.removeItem(`${getFullKey(key)}${EXPIRE}`);
  },
  setDomain(domain: string) {
    DOMAIN = `${domain}_`;
  },
  clearDomain(domain: string = DOMAIN) {
    for (let key of Object.keys(store)) if (key.includes(`${domain}_`)) store.removeItem(key);
  },
  bust() {
    store.clear();
  },
};
