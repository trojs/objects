import { expect, describe, it } from '@jest/globals';
import Obj from '../objects.js';

const schema = {
    sku: String
}
const ObjectWithSchema = Obj({ schema });

describe('Test createAll', () => {
    it('It should create an object for all items', () => {
        const data = [
            { sku: '123' },
            { sku: '124' },
        ]
        const result = ObjectWithSchema.createAll(data);
        expect(result).toEqual(data);

        const keys = result.map(item => item.keys());
        expect(keys).toEqual([
            ['sku'],
            ['sku']
        ]);
    });
});
