import { expect, describe, it } from '@jest/globals';
import Obj from '../objects';

const testSchema = {
    a: Number,
    b: Number,
};

//  deepcode ignore ExpectsArray: False error, it should allow an object
const Test = Obj({ schema: testSchema });

describe('Test objects.js map', () => {
    it('It should map the object like the array map', () => {
        const input = {
            a: 1,
            b: 2,
        };
        const expectedResult = {
            a: 2,
            b: 4,
        };

        expect(Test.create(input).map((x) => x * 2)).toMatchObject(
            expectedResult
        );
    });

    it('It should map the flat object like the array map', () => {
        const input = {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        };
        const expectedResult = {
            a: 2,
            b: 4,
            'c.0': 6,
            'c.1': 8,
            'd.e': 10,
            'd.f': 12,
            'g.h.i': 14,
        };

        expect(Test.create(input).flatMap((x) => x * 2)).toMatchObject(
            expectedResult
        );
    });
});
