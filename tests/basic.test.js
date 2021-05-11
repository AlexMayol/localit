import { localit as store } from '../dist/localit';

describe('Simple tests', () => {
    let key = 'basic'
    let value = 'Hello World';
    store.config({ domain: 'simple_tests' })

    store.bust();
    test('localStorage is empty', () => {
        expect(localStorage.length).toBe(0)
    })
    test('set() is called properly', () => {
        store.set(key, value)
        expect(localStorage.length).toBe(1)
    })
    test('get() is called properly', () => {
        expect(store.get(key)).toBe(value)
    })
    test('localStorage key is correct', () => {
        let included = Object.keys(localStorage).includes('simple_tests_basic')
        expect(included).toBeTruthy()
    })
})