import {localit} from './localit';

let ls = new localit('sessionStorage');
ls.clear();
ls.set('a', [1,2,3])
console.log(ls.get('a'))

ls.set('b', [4,5,6])
console.log(ls.get('b'))