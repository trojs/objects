import { expect, describe, it } from '@jest/globals';
import Obj from '../objects.js';

const testSchema = {
    a: Number,
    b: Number,
};

//  deepcode ignore ExpectsArray: False error, it should allow an object
const Test = Obj({ schema: testSchema });

describe('Test objects.js every', () => {
    it('It should return true because some value is 3', () => {
        const input = {
            a: 1,
            b: 2,
            c: 3,
        };

        expect(Test.create(input).some((x) => x === 3)).toBeTruthy();
    });

    it('It should return false because the is no value 4', () => {
        const input = {
            a: 1,
            b: 2,
            c: 3,
        };

        expect(Test.create(input).some((x) => x === 3)).toBeTruthy();
    });

    it('It should return true because some flat values are 2', () => {
        const input = {
            a: 1,
            b: 2,
            c: [1, 2],
            d: { e: 1, f: 2 },
            g: { h: { i: 1 } },
        };

        expect(Test.create(input).flatSome((x) => x === 2)).toBeTruthy();
    });

    it('It should return false because not some flat values are 3', () => {
        const input = {
            a: 1,
            b: 2,
            c: [1, 2],
            d: { e: 1, f: 2 },
            g: { h: { i: 1 } },
        };

        expect(Test.create(input).flatSome((x) => x === 3)).toBeFalsy();
    });
});
