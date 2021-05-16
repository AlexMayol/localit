# localit

A simple JS class to wrap localStorage and sessionStorage functionality. Supports expiration dates, so you can cache you data and retrieve it safely 🔥

## Install

`npm i localit`

## Example

```js
import { localit } from "localit";

// You can pass `localStorage` or `sessionStorage` as parameter. Defaults to `localStorage`

let data = [2, "red", { blue: "yellow" }];

// This data will be deleted in exactly 5 days since it was saved
localit.set("info", data, "5d");

// Call this today
// [2, 'red', {blue: 'yellow'}]

// Call this in 5 days
console.log(localit.get("info"));
// null

// Add a 'domain' to you store to automatically prefix the keys
localit.config({ domain: "tests" });
let data = { hello: "world" };
localit.set("simple_object", data, "2h");

// Now, you can retrieve the object with the get() method but it will be stores under the key 'tests_simple_object'
console.log(localit.get("simple_object"));
//{hello:'world'}

console.log(localStorage);
/*
Storage:{
    length: 2,
    tests_simple_object: "{"hello":"world"}"
    tests_simple_object_expiration_date: ""2020-11-30T11:35:31.041Z""
}
*/
```

## API reference

### config({domain = '', type = 'localStorage'})

```js
import { localit as store } from "localit";
```

You can define a domain on this `config` method, so all the keys you save afterwards will have it appended.

```js
store.config({ domain: "pets" });
store.set("dog", "Will");
//pets_dog = 'Will'
```

You can also specify if you want to use `sessionStorage` instead of `localStorage`

```js
store.config({ type: "sessionStorage" });
```

### set(key, val, expritationDate = null)

Localit takes care of objects so you don't neet do parse them yourself with `JSON.stringify`, which I find extremely annoying.

```js
// Just store any kind of data without parsing it
store.set("info", ["hello", "world"]);
// As an optional third parameter, you can set an expiration date
store.set("more_info", { avengers: "endgame" }, "5d");
```

The **expiration date** parameter accepts strings with a number and the type of time. For example, `5d` means that key will only be valid for 5 days, `30d` is 30 days and `132m` is 132 minutes.

The letter must be lowercase and only seconds(`s`), minutes (`m`), hours (`h`) and days (`d`) are allowed.

### get(key)

You will recieve the data in the original format it was stored: string, number, array or object... Localit handles the requerid parsing under the hood so you don't need to call `JSON.parse(...)`.

If you set an expiration date while saving the data, you'll get `null` if the current date is past the specified one.

```js
store.get("more_info");
// {avengers: 'endgame'}
```

### remove(key)

Removes the data and the expiration date key

```js
store.remove("info");
// null
```

### setDomain(name)

Change the domain of the store at any time, not only on instantiation time.

```js
store.setDomain("games");
store.set("Mario", ["Mario Galaxy", "Mario Party"]);
// games_Mario = ['Mario Galaxy', 'Mario Party']
```

### clearDomain(domain = '')

If you want to bulk remove all the data from a domain but keep the date from the rest, you can clear only the desired domain.

```js
store.setDomain("mammals_count");
store.set("dog", "21");
store.set("cat", "13");

store.setDomain("birds_count");
store.set("eagle", "10");
store.set("dove", "200");

console.log(localStorage);
/*
length: 4
birds_count_dove: "200"
birds_count_eagle: "10"
mammals_count_cat: "13"
mammals_count_dog: "21"
*/
store.clearDomain("mammals_count");
console.log(localStorage);

/*
length: 2
birds_count_dove: "200"
birds_count_eagle: "10"
*/
```

### bust()

Good ol' `clear()`. Will remove the entire data from the store, either localStorage or sessionStorage

```js
store.bust();

console.log(localStorage);

/*
length: 0
*/
```

## Why

I made Localit because localStorage API feels too long and inefficient - `setItem` instead of `set` and having to transform to/from JSON in order to save and retrieve was a huge pain when you are constantly using it.

I then thought it'd be cool to have some sort of expiration time for the data and it turned out pretty useful on some other projects.

## Running locally

The workflow right now is pretty basic. The source code is on `src/localit.ts`. You can generate the transpiled version by running `npm run build`, using a simple Rollup config.
