import { expect, describe, it } from '@jest/globals';
import Obj from '../objects.js';

describe('Object test', () => {
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
        address: addressSchema
    };

    it('It should throw an exception for level 1', () => {
        //  deepcode ignore ExpectsArray: False error, it should allow an object
        const Country = Obj({ schema: CountrySchema })
        expect(() => {
            Country.create({
                    name: 'Germany',
                    code: 'DE',
                    active: 'true',
            })
        }).toThrowError('The field active should be a Boolean')
    });

    it('It should throw an exception for level 2', () => {
        //  deepcode ignore ExpectsArray: False error, it should allow an object
        const Address = Obj({ schema: addressSchema })
        expect(() => {
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
            })
        }).toThrowError('The field country.active should be a Boolean')
    });

    it('It should throw an exception for level 3', () => {
        //  deepcode ignore ExpectsArray: False error, it should allow an object
        const Person = Obj({ schema: personSchema })
        expect(() => {
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
            })
        }).toThrowError('The field address.country.active should be a Boolean')
    });
});
