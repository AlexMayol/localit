import { Localit } from '../src/localit';

test('Simple strong set() and get()', () => {
    const store = new Localit({ domain: 'tests' })
    let key = 'basic'
    let result = 'Hello World';
    store.set(key, result);
    expect(store.get(key)).toBe(result);
});