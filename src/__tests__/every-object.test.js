import test from 'node:test';
import assert from 'assert';
import Obj from '../objects.js';

const testSchema = {
    a: Number,
    b: Number,
};

//  deepcode ignore ExpectsArray: False error, it should allow an object
const Test = Obj({ schema: testSchema });

test('Test objects.js every', async (t) => {
    await t.test('It should return true because every value is below 4', () => {
        const input = {
            a: 1,
            b: 2,
            c: 3,
        };

        assert.strictEqual(
            Test.create(input).every((x) => x < 4),
            true
        );
    });

    await t.test(
        'It should return false because not every value is below 3',
        () => {
            const input = {
                a: 1,
                b: 2,
                c: 3,
            };

            assert.strictEqual(
                Test.create(input).every((x) => x < 3),
                false
            );
        }
    );

    await t.test(
        'It should return true because every flat value is below 3',
        () => {
            const input = {
                a: 1,
                b: 2,
                c: [1, 2],
                d: { e: 1, f: 2 },
                g: { h: { i: 1 } },
            };

            assert.strictEqual(
                Test.create(input).flatEvery((x) => x < 3),
                true
            );
        }
    );

    await t.test(
        'It should return false because not every flat value is 2',
        () => {
            const input = {
                a: 1,
                b: 2,
                c: [1, 2],
                d: { e: 1, f: 2 },
                g: { h: { i: 1 } },
            };

            assert.strictEqual(
                Test.create(input).flatEvery((x) => x === 2),
                false
            );
        }
    );
});
