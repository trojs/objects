/* eslint-disable no-new */
import Obj from '../objects';
import test1Schema from '../schemas/test1';
import Test2 from '../schemas/test2';

describe('Object test', () => {
    const addressSchema = {
        street: String,
        number: 'number',
        postalCode: String,
        city: String,
        country: String,
        build: Function,
    };

    const Address = Obj({ schema: addressSchema });
    const Test = Obj({ schema: test1Schema });
    const test2 = new Test2('me');

    it('It should validate the input and set the original object', () => {
        const build = () => {};
        const myAddress = Address.create({
            street: 'Abc',
            number: 42,
            postalCode: '1234AB',
            city: 'Example',
            country: 'The Netherlands',
            build,
        });

        expect(myAddress).toEqual({
            street: 'Abc',
            number: 42,
            postalCode: '1234AB',
            city: 'Example',
            country: 'The Netherlands',
            build,
        });

        expect(myAddress.keys()).toEqual([
            'street',
            'number',
            'postalCode',
            'city',
            'country',
            'build',
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

    it('It should valid with this custom optional type', () => {
        const data = {
            name: 'test',
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
        });
    });

    it('It should valid with this custom type', () => {
        const data = {
            name: 'test',
            test: test2,
            test3: { name: 'test' },
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test3: { name: 'test' },
        });
    });

    it('It should valid with this custom type and sub array', () => {
        const data = {
            name: 'test',
            test: test2,
            test3: [{ name: 'test' }],
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test3: [{ name: 'test' }],
        });
    });

    it('It should throw an exception if the custom type is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                test: 'test',
            });
        }).toThrowError('The field ?test should be a Test2');
    });

    it('It should throw an exception if the sub schema is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                test3: 'test',
            });
        }).toThrowError('The field name should be a String');
    });

    it('It should throw an exception if the custom type is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                obj: 'test',
            });
        }).toThrowError('The field obj? should be a Object');
    });
});
