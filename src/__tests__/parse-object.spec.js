import { expect, describe, it } from '@jest/globals';
import Obj from '../objects.js';
import Int from '../int.js';

const subSchema = {
    a: Number,
    b: Boolean,
    'c?': String,
};

const testSchema = {
    a: Number,
    b: Boolean,
    'c?': String,
    '?d': Int,
    subSchema,
};

//  deepcode ignore ExpectsArray: False error, it should allow an object
const Test = Obj({ schema: testSchema });

describe('Test objects.js parse', () => {
    it('It should return the parsed object', () => {
        const input = {
            a: 1,
            b: true,
            c: 'test',
            d: 42,
            subSchema: {
                a: 1,
                b: true,
                c: 'test',
            },
        };

        expect(Test.parse(input)).toEqual({
            a: 1,
            b: true,
            c: 'test',
            d: 42,
            subSchema: {
                a: 1,
                b: true,
                c: 'test',
            },
        });
    });

    it('It should parse the values', () => {
        const input = {
            a: '1',
            b: 'true',
            c: 3,
            d: 42,
            subSchema: {
                a: '1',
                b: 'true',
                c: 3,
            },
        };

        expect(Test.parse(input)).toEqual({
            a: 1,
            b: true,
            c: '3',
            d: 42,
            subSchema: {
                a: 1,
                b: true,
                c: '3',
            },
        });
    });

    it('It should ignore optional fields', () => {
        const input = {
            a: '1',
            b: 'true',
            c: null,
            subSchema: {
                a: '1',
                b: 'true',
            },
        };

        expect(Test.parse(input)).toEqual({
            a: 1,
            b: true,
            c: null,
            subSchema: {
                a: 1,
                b: true,
            },
        });

        const input2 = {
            a: '1',
            b: 'true',
            subSchema: {
                a: '1',
                b: 'true',
            },
        };

        expect(Test.parse(input2)).toEqual({
            a: 1,
            b: true,
            subSchema: {
                a: 1,
                b: true,
            },
        });
    });

    it('It should validate the object', () => {
        const input = {
            a: '101',
            b: 'true',
            c: 102,
            subSchema: {
                a: '103',
                b: 'true',
                c: 'test with validation',
            },
        };

        expect(Test.parse(input, { validate: true })).toEqual({
            a: 101,
            b: true,
            c: '102',
            subSchema: {
                a: 103,
                b: true,
                c: 'test with validation',
            },
        });
    });

    it('It should handle a boolean with a string false', () => {
        const input = {
            a: '101',
            b: 'false',
            subSchema: {
                a: '103',
                b: 'false'
            },
        };

        expect(Test.parse(input)).toEqual({
            a: 101,
            b: false,
            subSchema: {
                a: 103,
                b: false,
            },
        });
    });
});
