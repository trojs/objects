import { expect, describe, it } from '@jest/globals';
import Obj from '../objects.js';

const schema = {
    sku: Number
}
const ObjectWithSchema = Obj({ schema });

describe('Test parseAll', () => {
    it('It should parse the object for all items', () => {
        const data = [
            { sku: '123' },
            { sku: '124' },
        ]
        const result = ObjectWithSchema.parseAll(data);
        const expected = [
            { sku: 123 },
            { sku: 124 },
        ]
        expect(result).toEqual(expected);
    });
});
