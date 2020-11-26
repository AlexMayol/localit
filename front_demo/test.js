import { Localit } from '../src/localit'
const store = new Localit({ domain: 'tests' });

store.set('basic_test', 'Hello frend', '30s')

console.log(store.store)
