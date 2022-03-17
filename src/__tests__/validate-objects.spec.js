/* eslint-disable max-statements */
/* eslint-disable no-new */
import { expect, describe, it } from '@jest/globals';
import Obj from '../objects.js';
import test1Schema from '../schemas/test1.js';
import Test2 from '../schemas/test2.js';

describe('Object test', () => {
    const addressSchema = {
        street: String,
        number: 'number',
        postalCode: String,
        city: String,
        country: String,
        build: Function,
        'example?': 'mixed',
        'obj?': 'object|string',
    };

    //  deepcode ignore ExpectsArray: False error, it should allow an object
    const Address = Obj({ schema: addressSchema });
    //  deepcode ignore ExpectsArray: False error, it should allow an object
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
            example: 'ok',
            obj: { test: 'ok' },
        });

        expect(myAddress).toEqual({
            street: 'Abc',
            number: 42,
            postalCode: '1234AB',
            city: 'Example',
            country: 'The Netherlands',
            build,
            example: 'ok',
            obj: { test: 'ok' },
        });

        expect(myAddress.keys()).toEqual([
            'street',
            'number',
            'postalCode',
            'city',
            'country',
            'build',
            'example',
            'obj.test',
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
        }).toThrowError('The field number should be a number ("xyz")');
    });

    it('It should throw an exception', () => {
        expect(() => {
            Address.create({
                street: 'Abc',
                number: 42,
                postalCode: '1234AB',
                city: 'Example',
            });
        }).toThrowError('The field country should be a String (undefined)');
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
            test3: { example: 'test' },
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test3: { example: 'test' },
        });
    });

    it('It should valid with this custom type and sub array', () => {
        const data = {
            name: 'test',
            test: test2,
            test3: [{ example: 'test' }],
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test3: [{ example: 'test' }],
        });
    });

    it('It should valid with this custom type and sub array v2', () => {
        const data = {
            name: 'test',
            test: test2,
            test5: [{ example: 'test', example2: 'test' }],
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test5: [{ example: 'test', example2: 'test' }],
        });
    });

    it('It should valid with this custom type and sub array v6', () => {
        const data = {
            name: 'test',
            test: test2,
            test6: { test7: [{ example: 'test' }] },
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test6: { test7: [{ example: 'test' }] },
        });
    });

    it('It should valid with a not existing key', () => {
        const data = {
            name: 'test',
            test: test2,
            test8: [{ example: 'test' }],
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test8: [{ example: 'test' }],
        });
    });

    it('It should valid with a string for test4', () => {
        const data = {
            name: 'test',
            test: test2,
            test4: 'ok',
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test4: 'ok',
        });
    });

    it('It should valid with a string for test4', () => {
        const data = {
            name: 'test',
            test: test2,
            test4: 42,
        };
        const test = Test.create(data);
        expect(test).toEqual({
            name: 'test',
            test: test2,
            test4: 42,
        });
    });

    it('It should throw an exception if test4 is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                test: test2,
                test4: true,
            });
        }).toThrowError('The field test4? should be a string|number (true)');
    });

    it('It should throw an exception if the custom type is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                test: 'test',
            });
        }).toThrowError('The field ?test should be a Test2 ("test")');
    });

    it('It should throw an exception if the sub schema is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                test3: 'test',
            });
        }).toThrowError(
            'The field test3?.example should be a String (undefined)'
        );
    });

    it('It should throw an exception if the custom type is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                obj: 'test',
            });
        }).toThrowError('The field obj? should be a Object ("test")');
    });

    it('It should throw an exception if the custom type is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                test3: [{ example: 42 }],
            });
        }).toThrowError('The field test3?.example should be a String (42)');
    });

    it('It should throw an exception if the custom type is invalid', () => {
        expect(() => {
            Test.create({
                name: 'test',
                test5: [{ example: 42 }],
            });
        }).toThrowError('The field ?test5.example should be a string (42)');
    });
});
