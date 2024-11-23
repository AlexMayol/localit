const store = window.localit.localit;
const key = "counter";

console.log(store.get(key));
store.set(key, 999, '5s');
