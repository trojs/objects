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
});
