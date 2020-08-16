import { Localit } from '../src/localit.js';

const store = new Localit();

store.setDomain('mammals_count');
store.set('dog', '21');
store.set('cat', '13');

store.setDomain('birds_count');
store.set('eagle', '10');
store.set('dove', 200);


store.clearDomain('mammals_count')
// store.bust()
console.log(localStorage)