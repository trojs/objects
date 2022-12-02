import test from 'node:test';
import assert from 'node:assert';
import { Obj } from '../objects.js';

const schema = {
    sku: Number,
};
const ObjectWithSchema = Obj({ schema });

test('Test parseAll', async (t) => {
    await t.test('It should parse the object for all items', () => {
        const data = [{ sku: '123' }, { sku: '124' }];
        const result = ObjectWithSchema.parseAll(data);
        const expected = [{ sku: 123 }, { sku: 124 }];
        assert.deepEqual(result, expected);
    });
});
