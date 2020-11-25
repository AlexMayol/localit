import { Localit } from '../src/localit.js';

const store = new Localit();

store.bust();
store.setDomain('seconds_test');


store.set('aa', {hello: 'world'}, '180i')
console.log(store.get('aa'))
console.log(store.store)
