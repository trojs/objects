/* eslint-disable no-new */
import Obj from '../objects';

describe('Object test', () => {
    const addressSchema = {
        street: String,
        number: 'number',
        postalCode: String,
        city: String,
        country: String,
    };

    const Address = Obj({ schema: addressSchema });

    it('It should validate the input and set the original object', () => {
        const myAddress = Address.create({
            street: 'Abc',
            number: 42,
            postalCode: '1234AB',
            city: 'Example',
            country: 'The Netherlands',
        });

        expect(myAddress).toEqual({
            street: 'Abc',
            number: 42,
            postalCode: '1234AB',
            city: 'Example',
            country: 'The Netherlands',
        });

        expect(myAddress.keys()).toEqual([
            'street',
            'number',
            'postalCode',
            'city',
            'country',
        ]);
    });

    it('It should throw an exception', () => {
        expect(() => {
            Address.create({
                street: 'Abc',
                number: 'xyz',
                postalCode: '1234AB',
                city: 'Example',
                country: 'The Netherlands',
            });
        }).toThrowError('The field number should be a number');
    });

    it('It should throw an exception', () => {
        expect(() => {
            Address.create({
                street: 'Abc',
                number: 42,
                postalCode: '1234AB',
                city: 'Example',
            });
        }).toThrowError('The field country should be a String');
    });
});
