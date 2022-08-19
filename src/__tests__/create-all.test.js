import test from 'node:test';
import assert from 'assert';
import Obj from '../objects.js';

const schema = {
    sku: String,
};
const ObjectWithSchema = Obj({ schema });

test('Test createAll', async (t) => {
    await t.test('It should create an object for all items', () => {
        const data = [{ sku: '123' }, { sku: '124' }];
        const result = ObjectWithSchema.createAll(data);
        assert.deepEqual(result, data);

        const keys = result.map((item) => item.keys());
        assert.deepEqual(keys, [['sku'], ['sku']]);
    });
});
