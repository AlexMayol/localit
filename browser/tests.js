const store = window.localit.localit;

store.set("browser", [1, 2, 3], "3d");

console.log(store.get("browser"));