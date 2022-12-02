import test from 'node:test';
import assert from 'node:assert';
import { Obj } from '../objects.js';

const testSchema = {
    a: Number,
    b: Number,
};

//  deepcode ignore ExpectsArray: False error, it should allow an object
const Test = Obj({ schema: testSchema });

test('Test objects.js filter', async (t) => {
    await t.test('It should map the object like the array filter', () => {
        const input = {
            a: 1,
            b: 2,
        };
        const expectedResult = {
            a: 1,
        };

        assert.deepEqual(
            Test.create(input).filter((x) => x === 1),
            expectedResult
        );
    });

    await t.test('It should map the flat object like the array filter', () => {
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

        assert.deepEqual(
            Test.create(input).flatFilter((x) => x === 1),
            expectedResult
        );
    });
});
