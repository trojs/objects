import test from 'node:test';
import assert from 'assert';
import Obj from '../objects.js';

test('Object test', async (t) => {
    const CountrySchema = {
        name: String,
        code: String,
        active: Boolean,
    };

    const addressSchema = {
        street: String,
        number: 'number',
        postalCode: String,
        city: String,
        country: CountrySchema,
    };

    const personSchema = {
        name: String,
        address: addressSchema,
    };

    await t.test('It should throw an exception for level 1', () => {
        //  deepcode ignore ExpectsArray: False error, it should allow an object
        const Country = Obj({ schema: CountrySchema });
        try {
            Country.create({
                name: 'Germany',
                code: 'DE',
                active: 'true',
            });
        } catch (error) {
            assert.strictEqual(
                error.message,
                'The field active should be a Boolean ("true")'
            );
        }
    });

    await t.test('It should throw an exception for level 2', () => {
        //  deepcode ignore ExpectsArray: False error, it should allow an object
        const Address = Obj({ schema: addressSchema });
        try {
            Address.create({
                street: 'Abc',
                number: 42,
                postalCode: '1234AB',
                city: 'Example',
                country: {
                    name: 'Germany',
                    code: 'DE',
                    active: 'true',
                },
            });
        } catch (error) {
            assert.strictEqual(
                error.message,
                'The field country.active should be a Boolean ("true")'
            );
        }
    });

    await t.test('It should throw an exception for level 3', () => {
        //  deepcode ignore ExpectsArray: False error, it should allow an object
        const Person = Obj({ schema: personSchema });
        try {
            Person.create({
                name: 'John',
                address: {
                    street: 'Abc',
                    number: 42,
                    postalCode: '1234AB',
                    city: 'Example',
                    country: {
                        name: 'Germany',
                        code: 'DE',
                        active: 'true',
                    },
                },
            });
        } catch (error) {
            assert.strictEqual(
                error.message,
                'The field address.country.active should be a Boolean ("true")'
            );
        }
    });
});
