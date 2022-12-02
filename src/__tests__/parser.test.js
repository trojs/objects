/* eslint-disable no-new */
import test from 'node:test';
import assert from 'node:assert';
import Parser from '../parser.js';

const testSchema = {
    a: Number,
    b: Boolean,
    'c?': String,
};

test('Test parser.js', async (t) => {
    await t.test('It should parse the values', () => {
        const input = {
            a: '42',
            b: '1',
            c: 42,
            d: 'test',
        };
        const parse = new Parser({ schema: testSchema });

        assert.deepEqual(parse.parseObject(input), {
            a: 42,
            b: true,
            c: '42',
            d: 'test',
        });
    });

    await t.test('It should parse the undefined values', () => {
        const input = {
            a: undefined,
            b: undefined,
            c: undefined,
            d: undefined,
        };
        const parse = new Parser({ schema: testSchema });

        assert.deepEqual(parse.parseObject(input), {
            a: undefined,
            b: undefined,
            c: undefined,
            d: undefined,
        });
    });

    await t.test('It should parse the nullish values', () => {
        const input = {
            a: null,
            b: null,
            c: null,
            d: null,
        };
        const parse = new Parser({ schema: testSchema });

        assert.deepEqual(parse.parseObject(input), {
            a: null,
            b: null,
            c: null,
            d: null,
        });
    });

    const testCases = [
        { a: 'y', b: true },
        { a: 'yes', b: true },
        { a: 'Y', b: true },
        { a: 'YES', b: true },
        { a: 'true', b: true },
        { a: 'on', b: true },
        { a: 1, b: true },
        { a: true, b: true },
        { a: '1', b: true },
        { a: 'n', b: false },
        { a: 'bla', b: false },
        { a: 'false', b: false },
        { a: '0', b: false },
        { a: 0, b: false },
        { a: 2, b: false },
        { a: -1, b: false },
        { a: {}, b: false },
        { a: [], b: false },
    ];
    await t.test('It should parse booleans', async (t2) => {
        await Promise.all(
            testCases.map(async ({ a, b }) => {
                await t2.test(
                    `It should parse the boolean values {$a} -> {$b}`,
                    () => {
                        const input = {
                            a: null,
                            b: a,
                            c: null,
                            d: null,
                        };
                        const parse = new Parser({ schema: testSchema });

                        assert.deepEqual(parse.parseObject(input), {
                            a: null,
                            b,
                            c: null,
                            d: null,
                        });
                    }
                );
            })
        );
    });
});
