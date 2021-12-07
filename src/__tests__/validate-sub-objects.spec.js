import { expect, describe, it } from '@jest/globals';
import Obj from '../objects.js';

describe('Object test', () => {
    const CountrySchema = {
        name: String,
        code: String,
        active: Boolean
    };

    const addressSchema = {
        street: String,
        number: 'number',
        postalCode: String,
        city: String,
        country: CountrySchema
    };

    //  deepcode ignore ExpectsArray: False error, it should allow an object
    const Address = Obj({ schema: addressSchema });

    it('It should throw an exception', () => {
        expect(() => {
            Address.create({
                street: 'Abc',
                number: 42,
                postalCode: '1234AB',
                city: 'Example',
                country: {
                    name: 'Germany',
                    code: 'DE',
                    active: 'true'
                },
            });
        }).toThrowError('The field country.active should be a Boolean');
    });
});
