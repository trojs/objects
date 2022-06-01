/* eslint-disable no-new */
import { expect, describe, it } from '@jest/globals';
import Parser from '../parser.js';

const testSchema = {
    a: Number,
    b: Boolean,
    'c?': String,
};

describe('Test parser.js', () => {
    it('It should parse the values', () => {
        const input = {
            a: '42',
            b: '1',
            c: 42,
            d: 'test',
        };
        const parse = new Parser({ schema: testSchema });

        expect(parse.parseObject(input)).toEqual({
            a: 42,
            b: true,
            c: '42',
            d: 'test',
        });
    });

    it('It should parse the undefined values', () => {
        const input = {
            a: undefined,
            b: undefined,
            c: undefined,
            d: undefined,
        };
        const parse = new Parser({ schema: testSchema });

        expect(parse.parseObject(input)).toEqual({
            a: undefined,
            b: undefined,
            c: undefined,
            d: undefined,
        });
    });

    it('It should parse the nullish values', () => {
        const input = {
            a: null,
            b: null,
            c: null,
            d: null,
        };
        const parse = new Parser({ schema: testSchema });

        expect(parse.parseObject(input)).toEqual({
            a: null,
            b: null,
            c: null,
            d: null,
        });
    });

    it.each([
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
    ])('It should parse the boolean values $a -> $b', ({ a, b }) => {
        const input = {
            a: null,
            b: a,
            c: null,
            d: null,
        };
        const parse = new Parser({ schema: testSchema });

        expect(parse.parseObject(input)).toEqual({
            a: null,
            b,
            c: null,
            d: null,
        });
    });
});
