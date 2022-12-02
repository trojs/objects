import test from 'node:test';
import assert from 'node:assert';
import { Obj } from '../objects.js';
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

test('Test objects.js parse', async (t) => {
    await t.test('It should return the parsed object', () => {
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

        assert.deepEqual(Test.parse(input), {
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

    await t.test('It should parse the values', () => {
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

        assert.deepEqual(Test.parse(input), {
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

    await t.test('It should ignore optional fields', () => {
        const input = {
            a: '1',
            b: 'true',
            c: null,
            subSchema: {
                a: '1',
                b: 'true',
            },
        };

        assert.deepEqual(Test.parse(input), {
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

        assert.deepEqual(Test.parse(input2), {
            a: 1,
            b: true,
            subSchema: {
                a: 1,
                b: true,
            },
        });
    });

    await t.test('It should validate the object', () => {
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

        assert.deepEqual(Test.parse(input, { validate: true }), {
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

    await t.test('It should handle a boolean with a string false', () => {
        const input = {
            a: '101',
            b: 'false',
            subSchema: {
                a: '103',
                b: 'false',
            },
        };

        assert.deepEqual(Test.parse(input), {
            a: 101,
            b: false,
            subSchema: {
                a: 103,
                b: false,
            },
        });
    });
});
