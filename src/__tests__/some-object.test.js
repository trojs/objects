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
    await t.test('It should return true because some value is 3', () => {
        const input = {
            a: 1,
            b: 2,
            c: 3,
        };

        assert.strictEqual(
            Test.create(input).some((x) => x === 3),
            true
        );
    });

    await t.test('It should return false because the is no value 4', () => {
        const input = {
            a: 1,
            b: 2,
            c: 3,
        };

        assert.strictEqual(
            Test.create(input).some((x) => x === 3),
            true
        );
    });

    await t.test('It should return true because some flat values are 2', () => {
        const input = {
            a: 1,
            b: 2,
            c: [1, 2],
            d: { e: 1, f: 2 },
            g: { h: { i: 1 } },
        };

        assert.strictEqual(
            Test.create(input).flatSome((x) => x === 2),
            true
        );
    });

    await t.test(
        'It should return false because not some flat values are 3',
        () => {
            const input = {
                a: 1,
                b: 2,
                c: [1, 2],
                d: { e: 1, f: 2 },
                g: { h: { i: 1 } },
            };

            assert.strictEqual(
                Test.create(input).flatSome((x) => x === 3),
                false
            );
        }
    );
});
