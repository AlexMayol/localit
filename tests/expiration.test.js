import wait from 'waait';
import 'regenerator-runtime/runtime'
import { localit as store } from '../dist/localit';

describe('Saving and retrieving objects', () => {
    let domain = 'expiration_tests'
    let key = 'timed_value';
    let value = 'A temporary string'
    let expiration_time = '10s'
    store.config({ domain })
    store.bust();

    test('value is stored with expiration date', () => {
        store.set(key, value, expiration_time)
        expect(localStorage.length).toBe(2)
    })
    test('expiration date key is present in localStorage', () => {
        let final_key = `${domain}_${key}_expiration_date`
        let included = Object.keys(localStorage).includes(final_key)
        expect(included).toBeTruthy()
    })
    test('value is retrievable within its life span', () => {
        expect(store.get(key)).toEqual(value)
    })
    test('value is no longer retrievable after the expiration date', async () => {
        jest.setTimeout(30000);
        await wait(11000)
        expect(store.get(key)).toEqual(null)
    })
    test('localStorage is empty after the expiration date has passed', () => {
        expect(localStorage.length).toBe(0)
    })

})