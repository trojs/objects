import test from 'node:test';
import assert from 'node:assert';
import { Obj } from '../objects.js';

const testSchema = {
    a: Number,
    b: Number,
};

//  deepcode ignore ExpectsArray: False error, it should allow an object
const Test = Obj({ schema: testSchema });

test('Test objects.js map', async (t) => {
    await t.test('It should map the object like the array map', () => {
        const input = {
            a: 1,
            b: 2,
        };
        const expectedResult = {
            a: 2,
            b: 4,
        };

        assert.deepEqual(
            Test.create(input).map((x) => x * 2),
            expectedResult
        );
    });

    await t.test('It should map the flat object like the array map', () => {
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

        assert.deepEqual(
            Test.create(input).flatMap((x) => x * 2),
            expectedResult
        );
    });

    await t.test('It should use the key of the map', () => {
        const input = {
            a: 1,
            b: 2,
        };
        const expectedResult = {
            a: 'a',
            b: 'b',
        };

        assert.deepEqual(
            Test.create(input).map((x, y) => y),
            expectedResult
        );
    });

    await t.test('It should use the original result of the map', () => {
        const input = {
            a: 1,
            b: 2,
        };
        const expectedResult = {
            a: {
                a: 1,
                b: 2,
            },
            b: {
                a: 1,
                b: 2,
            },
        };

        assert.deepEqual(
            Test.create(input).map((x, y, z) => z),
            expectedResult
        );
    });
});
