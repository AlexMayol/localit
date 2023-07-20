const store = window.localit.localit;
const key = "pepe_counter";
store.bust();

let count = 0;

// store.on(`${key}`, (data) => { count = data?.value; console.log(`count is ${count}`) });

store.set(key, 2);
store.set(key, 4);
store.remove(key);

store.set(key, "4olee");
console.log(store.get);
