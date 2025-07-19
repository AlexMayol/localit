# localit
![minzip size](https://badgen.net/bundlephobia/minzip/localit)
![dependency count](https://badgen.net/bundlephobia/dependency-count/localit)
![tree-shakeable](https://badgen.net/bundlephobia/tree-shaking/localit)


🔥 A lightweight, fully-typed wrapper around the Web Storage API (`localStorage` / `sessionStorage`) with expiration support, optional key namespacing, and change event listeners.

## ✅ Features

- Store/retrieve plain and complex values easily, no `JSON.stringify` required.
- Expiration time support, you decide how log to cache the data
- Family-based key namespacing
- Listen to changes on individual keys
- No dependencies, <1kB gzipped

---

## 📦 Install

```bash
npm i localit
# or
yarn add localit
# or
pnpm add localit
```

---

## 🚀 Usage

### Import

```ts
import { localit } from "localit";
```

---

### `set(key, value, config?)`

Store a value in storage.

```ts
localit.set("foo", { bar: 42 }, { expiration: "5m" });
localit.set("name", "User123", { family: "user" });
localit.set("list", new Set([1, 2, 3]), { type: sessionStorage });
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
localit.set("lasts-a-day", { some: "data" }, { expiration: tomorrow });
```

Config options:

- `type`: `localStorage` (default) or `sessionStorage`
- `family`: string to namespace the key (stored as `family::key`)
- `expiration`: `"Xs"`, `"Xm"`, `"Xh"`, or `"Xd"`. Also accepts a `Date` object for a fixed expiration date.

---

### `get(key, config?)`

Retrieve a value.

```ts
const value = localit.get("foo");
const set = localit.get<Set<number>>("list");
```

If the value has expired, it will be removed and `null` is returned.

---

### `remove(key, config?)`

Delete a specific key.

```ts
localit.remove("foo");
```

Also, specify a family for even more control

```ts
localit.set('foo', 'bar') // Will be stored with 'foo' as key
localit.set('foo', 'baz' { family: 'bar' }) // Will be stores with 'bar::foo key

localit.remove('foo') // Will detele 'foo' but not 'bar::foo'
```

---

### `clearFamily(family, storage?)`

Remove all keys that belong to a given family.

```ts
localit.clearFamily("user");
localit.clearFamily("cache", sessionStorage); // Only delete `cache` family in sessionStorage, localStorage keys are kept intact
```

---

### `bust(storage?)`

Clear all keys from the given storage (`localStorage` by default)

```ts
localit.bust(); // clears localStorage
localit.bust(sessionStorage); // clears sessionStorage
```

---

### `on(key, callback)`

Subscribe to key changes (e.g. via `set()` or `remove()`).

```ts
localit.on("foo", (newValue) => {
  console.log("foo changed:", newValue);
});
```

Note: this is _not_ the same as the native `storage` event—it only triggers within the current context when `localit` methods are used.

---

## 🧪 Example

```ts
localit.set("cart", { count: 3 }, { expiration: "2h" });

const cart = localit.get("cart"); // { count: 3 }

localit.on("cart", (val) => {
  console.log("Cart updated:", val);
});

localit.set("cart", { count: 4 }); // logs: Cart updated: { count: 4 }
```

---

## 📚 Types

```ts
type ExpirationType =
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | Date;

type LocalitSetConfig = {
  type?: Storage;
  family?: string;
  expiration?: ExpirationType;
};

type LocalitGetConfig = {
  type?: Storage;
  family?: string;
};
```

---

## 🛠 Author

**Alejandro Mayol**  
[github.com/alexmayol](https://github.com/alexmayol)
