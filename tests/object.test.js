import { Localit } from '../src/localit';

test('set() and get() for objects', () => {
    const store = new Localit({ domain: 'tests' })
    let key = 'objects'
    let result = {
        complex: false,
        optimal: false,
        brave: 'definitely'
    };
    store.set(key, result);
    expect(store.get(key)).toEqual(result);
});

test('set and modify object, different data', () => {
    const store = new Localit({ domain: 'tests' })
    let key = 'diffs'
    let result = {
        complex: false,
        optimal: false,
        brave: 'definitely'
    };
    store.set(key, result);
    result.newProp = true
    expect(store.get(key)).not.toEqual(result);
});