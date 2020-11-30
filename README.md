# localit

A simple JS class to wrap localStorage and sessionStorage functionality. Supports expiration dates, so you can cache you data and retrieve it safely 🔥

## Install

`npm i localit`

## Example

```js
import { Localit } from "localit";

// You can pass `localStorage` or `sessionStorage` as parameter. Defaults to `localStorage`
let store = new Localit();

let data = [2, "red", { blue: "yellow" }];

// This data will be deleted in exactly 5 days since it was saved
store.set("info", data, "5d");

// Call this today
// [2, 'red', {blue: 'yellow'}]

// Call this in 5 days
console.log(store.get("info"));
// null

// Add a 'domain' to you store to automatically prefix the keys
let store = new Localit({domain: 'tests'});
let data = {hello:'world'};
store.set('simple_object', data, '2h');

// Now, you can retrieve the object with the get() method but it will be stores under the key 'tests_simple_object'
console.log(store.get('simple_object'));
//{hello:'world'}

console.log(localStorage)
/*
Storage:{
    length: 2,
    tests_simple_object: "{"hello":"world"}"
    tests_simple_object_expiration_date: ""2020-11-30T11:35:31.041Z""
}
*/
```

## API reference

### Constructor({domain = '', type = 'localStorage'} = {})

Localit is a JS class, so you need to instantiate it.

```js
const store = new Localit();
```

You can define a domain on this constructor, so all the keys you save will have it appended.

```js
const store = new Localit({ domain: "pets" });
store.set("dog", "Will");
//pets_dog = 'Will'
```

### set(key, val, expritation_date = null)

Localit takes care of objects so you don't neet do parse them yourself with `JSON.stringify`, which I find extremely annoying.

```js
store.set("info", ["hello", "world"]);
store.set("more_info", { avengers: "endgame" }, "5d");
```

### get(key)

Like `get(...)`, you will recieve the data in the original format it was stores: string or object.
If you set an expiration date when you save the data, you'll get `null` if the current date is later.

```js
store.get("more_info");
// {avengers: 'endgame'}
```

### remove(key)

Removes the data and the expiration date register

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
birds_count_dove: "200"
birds_count_eagle: "10"
length: 4
mammals_count_cat: "13"
mammals_count_dog: "21"
*/
store.clearDomain("mammals_count");
console.log(localStorage);

/*
birds_count_dove: "200"
birds_count_eagle: "10"
length: 2
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

The workflow right now is pretty basic. The source code is on `src/localit.js`. You can generate the transpiled version by running `npm run build`, using Parcel under the hood.
