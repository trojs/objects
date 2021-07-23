import { expect, describe, it } from '@jest/globals';
import Obj from '../objects';

const testSchema = {
    a: Number,
    b: Number,
};

//  deepcode ignore ExpectsArray: False error, it should allow an object
const Test = Obj({ schema: testSchema });

describe('Test objects.js filter', () => {
    it('It should map the object like the array filter', () => {
        const input = {
            a: 1,
            b: 2,
        };
        const expectedResult = {
            a: 1,
        };

        expect(Test.create(input).filter((x) => x === 1)).toMatchObject(
            expectedResult
        );
    });

    it('It should map the flat object like the array filter', () => {
        const input = {
            a: 1,
            b: 2,
            c: [1, 2],
            d: { e: 1, f: 2 },
            g: { h: { i: 1 } },
        };
        const expectedResult = {
            a: 1,
            'c.0': 1,
            'd.e': 1,
            'g.h.i': 1,
        };

        expect(Test.create(input).flatFilter((x) => x === 1)).toMatchObject(
            expectedResult
        );
    });
});
