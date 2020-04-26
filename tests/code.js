import {Localit} from '../src/localit.js';

const store = new Localit();
store.setDomain('youtubers')

// store.set('willy', 'willy es el puto amo tt', '1h')

console.log(store.get('willy'))