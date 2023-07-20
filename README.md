# localit

Manage the Storage API in a simpler and more efficient way.

It allows you to store and retrieve key-value pairs, set expiration times for values, and listen for changes on specific keys. The library supports configuration options, event handling, and domain management.

## Install

You can install `localit` using your preferred package manager.

`npm i localit`
`yarn add localit`
`pnpm add localit`

## Usage

To use `localit` in your project, import the `localit` object from the library:

```js
import { localit } from "localit";
```

The localit object provides various methods for interacting with `Storage`:

### Configuration

`config({ domain, type })`
Sets the default configuration for storing data. The config method accepts a configuration object with the following optional properties:

- `domain`: The name of the domain that will prefix all stored keys. If not provided, no domain prefix will be used.
- `type`: The type of storage to use. It can be either `localStorage` or `sessionStorage`. The default value is `localStorage`.

```js
localit.config({
  domain: "mydomain",
  type: "localStorage",
});
```

### Storing and Retrieving Values

`localit`'s main goal is to wrap the native `Storage` API available in the browser. It provides a simpler and more efficient way to store and retrieve values, without the need to use `JSON.stringify` and `JSON.parse`.

#### `set(key, value, expirationTime?)`

Stores the given key-value pair in the storage. Additionally, an **expiration time** can be set for the value.

- `key`: the key to store in the storage.
- `value`: the value to store.
- `expirationTime` _(optional)_: the duration for which the value will remain stored. It can be specified in seconds ("_Xs_"), minutes ("_Xm_"), hours ("_Xh_"), or days ("_Xd_"), where _X_ represents any number.

Example:

```js
localit.set("myKey", "myValue", "1h");
localit.set("otherKey", { oh: 8 }, "300s");
```

#### `get(key)`

Retrieves the value associated with the given key from the storage. It uses the current domain.

- `key`: the key used to retrieve the value.

If the value has expired due to the expiration date that was set, it will be removed from the storage and `null` will be returned.

Example:

```js
const value = localit.get("myKey"); // value = 'myValue'
```

### Removing values

The other side of the coin is removing values from `Storage`. `localit` provides two methods for removing values: `remove` and `getAndRemove`.

#### `remove(key)`

Removes the given key and its associated value from `Storage`. It uses the current domain.

- `key`: the key to remove from `Storage`.

Example:

```js
localit.remove("myKey");
```

#### `getAndRemove(key)`

Retrieves the value associated with the given key from `Storage` and then removes it. It uses the current domain.

- `key`: the key to get the value of and then remove from `Storage`.

Example:

```js
const value = localit.getAndRemove("myKey");
```

### Domain management

Domains let you store data in different namespaces. This is useful when working in an app where multiple, independent teams contribute, avoiding having key duplicates - and, thus, overwriting data. The domain name is prepended to the key when storing values, but you don't need to specify it again when using the `get()` method.

#### `setDomain(domainName)`

- `domain`: the name of the domain that will prefix all the keys until changed again.

Example:

```js
localit.setDomain("myNewDomain");
```

#### `clearDomain(domain?)`

Removes all the stored values for the specified domain. If no domain is provided, it clears the values for the current domain.

Example:

`localit.clearDomain('myDomain')`

#### `bust()`

Removes all the stored values in `Storage`, regardless of the current domain.

```js
localit.bust();
```

### Event Handling

A very interesting feature of `localit` is the ability to listen for changes on specific keys. This is useful when you want to update the UI when a value changes, for example. [Please, note that this is different from the `storage` event.](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

`on(key, callback)`
Adds a new listener to track changes on a specific key.

- `key`: the key to attach the callback.
- `callback`: the callback function to be called when the key is emitted by `localit`.

Example:

```js
localit.on("myKey", (value) => {
  console.log(`Value changed: ${value}`);
});

localit.set("myKey", "newValue"); // console.log: Value changed: 'newValue'
```
