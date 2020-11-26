import { Localit } from '../src/localit';

test('Set an expiration date for a key)', () => {
    const store = new Localit({ domain: 'advanced_tests' })
    let key = 'expiration'
    let result = 'You shall prevail';
    store.set(key, result, '5h');
    expect(localStorage.getItem('advanced_tests_expiration')).not.toBeNull();
});

test('Set an expiration date for a key 2)', () => {
    const store = new Localit({ domain: 'advanced_tests' })
    let key = 'expiration_2'
    let result = 'You shall prevail';
    store.set(key, result, '6h');
    expect(localStorage.getItem('advanced_tests_expiration_3')).toBeNull();
});