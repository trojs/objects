/* eslint-disable max-statements */

import test from 'node:test'
import assert from 'node:assert'
import { Obj } from '../objects.js'
import test1Schema from '../schemas/test1.js'
import Test2 from '../schemas/test2.js'

/* eslint-disable sonarjs/no-duplicate-string */

test('Object test', async (t) => {
    const addressSchema = {
        street: String,
        number: 'number',
        postalCode: String,
        city: String,
        country: String,
        build: Function,
        'example?': 'mixed',
        'obj?': 'object|string'
    }

    //  deepcode ignore ExpectsArray: False error, it should allow an object
    const Address = Obj({ schema: addressSchema })
    //  deepcode ignore ExpectsArray: False error, it should allow an object
    const Test = Obj({ schema: test1Schema })
    const test2 = new Test2('me')

    await t.test(
        'It should validate the input and set the original object',
        () => {
            const build = () => {}
            const myAddress = Address.create({
                street: 'Abc',
                number: 42,
                postalCode: '1234AB',
                city: 'Example',
                country: 'The Netherlands',
                build,
                example: 'ok',
                obj: { test: 'ok' }
            })

            assert.deepEqual(myAddress, {
                street: 'Abc',
                number: 42,
                postalCode: '1234AB',
                city: 'Example',
                country: 'The Netherlands',
                build,
                example: 'ok',
                obj: { test: 'ok' }
            })

            assert.deepEqual(myAddress.keys(), [
                'street',
                'number',
                'postalCode',
                'city',
                'country',
                'build',
                'example',
                'obj.test'
            ])
        }
    )

    await t.test('It should throw an exception', () => {
        try {
            Address.create({
                street: 'Abc',
                number: 'xyz',
                postalCode: '1234AB',
                city: 'Example',
                country: 'The Netherlands'
            })
        } catch (error) {
            assert.strictEqual(
                error.message,
                'The field number should be a number ("xyz")'
            )
        }
    })

    await t.test('It should throw an exception', () => {
        try {
            Address.create({
                street: 'Abc',
                number: 42,
                postalCode: '1234AB',
                city: 'Example'
            })
        } catch (error) {
            assert.strictEqual(
                error.message,
                'The field country should be a String (undefined)'
            )
        }
    })

    await t.test('It should throw an exception', () => {
        try {
            Address.create({
                street: 'Abc',
                number: 42,
                postalCode: '1234AB',
                city: 'Example',
                country: ''
            })
        } catch (error) {
            assert.strictEqual(
                error.message,
                'The field country should be a String ("")'
            )
        }
    })

    await t.test('It should valid with this custom optional type', () => {
        const data = {
            name: 'test'
        }
        const example = Test.create(data)
        assert.deepEqual(example, {
            name: 'test'
        })
    })

    await t.test('It should valid with this custom type', () => {
        const data = {
            name: 'test',
            test: test2,
            test3: { example: 'test' }
        }
        const example = Test.create(data)
        assert.deepEqual(example, {
            name: 'test',
            test: test2,
            test3: { example: 'test' }
        })
    })

    await t.test('It should valid with this custom type and sub array', () => {
        const data = {
            name: 'test',
            test: test2,
            test3: [{ example: 'test' }]
        }
        const example = Test.create(data)
        assert.deepEqual(example, {
            name: 'test',
            test: test2,
            test3: [{ example: 'test' }]
        })
    })

    await t.test(
        'It should valid with this custom type and sub array v2',
        () => {
            const data = {
                name: 'test',
                test: test2,
                test5: [{ example: 'test', example2: 'test' }]
            }
            const example = Test.create(data)
            assert.deepEqual(example, {
                name: 'test',
                test: test2,
                test5: [{ example: 'test', example2: 'test' }]
            })
        }
    )

    await t.test(
        'It should valid with this custom type and sub array v6',
        () => {
            const data = {
                name: 'test',
                test: test2,
                test6: { test7: [{ example: 'test' }] }
            }
            const example = Test.create(data)
            assert.deepEqual(example, {
                name: 'test',
                test: test2,
                test6: { test7: [{ example: 'test' }] }
            })
        }
    )

    await t.test('It should valid with a not existing key', () => {
        const data = {
            name: 'test',
            test: test2,
            test8: [{ example: 'test' }]
        }
        const example = Test.create(data)
        assert.deepEqual(example, {
            name: 'test',
            test: test2,
            test8: [{ example: 'test' }]
        })
    })

    await t.test('It should valid with a string for test4', () => {
        const data = {
            name: 'test',
            test: test2,
            test4: 'ok'
        }
        const example = Test.create(data)
        assert.deepEqual(example, {
            name: 'test',
            test: test2,
            test4: 'ok'
        })
    })

    await t.test('It should valid with a string for test4', () => {
        const data = {
            name: 'test',
            test: test2,
            test4: 42
        }
        const example = Test.create(data)
        assert.deepEqual(example, {
            name: 'test',
            test: test2,
            test4: 42
        })
    })

    await t.test('It should throw an exception if test4 is invalid', () => {
        try {
            Test.create({
                name: 'test',
                test: test2,
                test4: true
            })
        } catch (error) {
            assert.strictEqual(
                error.message,
                'The field test4? should be a string|number (true)'
            )
        }
    })

    await t.test(
        'It should throw an exception if the custom type is invalid',
        () => {
            try {
                Test.create({
                    name: 'test',
                    test: 'test'
                })
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'The field ?test should be a Test2 ("test")'
                )
            }
        }
    )

    await t.test(
        'It should throw an exception if the sub schema is invalid',
        () => {
            try {
                Test.create({
                    name: 'test',
                    test3: 'test'
                })
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'The field test3?.example should be a String (undefined)'
                )
            }
        }
    )

    await t.test(
        'It should throw an exception if the custom type is invalid',
        () => {
            try {
                Test.create({
                    name: 'test',
                    obj: 'test'
                })
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'The field obj? should be a Object ("test")'
                )
            }
        }
    )

    await t.test(
        'It should throw an exception if the custom type is invalid',
        () => {
            try {
                Test.create({
                    name: 'test',
                    test3: [{ example: 42 }]
                })
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'The field test3?.example should be a String (42)'
                )
            }
        }
    )

    await t.test(
        'It should throw an exception if the custom type is invalid',
        () => {
            try {
                Test.create({
                    name: 'test',
                    test5: [{ example: 42 }]
                })
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'The field ?test5.example should be a string (42)'
                )
            }
        }
    )
})
