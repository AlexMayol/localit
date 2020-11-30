import { Localit } from '../src/localit'
let store = new Localit({ domain: 'tests' });
let data = { hello: 'world' };
store.set('simple_object', data, '2h');

console.log(localStorage)