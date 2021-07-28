/* eslint-disable no-new */
import { expect, describe, it } from '@jest/globals';
import Int from '../int';

describe('Test int.js', () => {
    it('It should build a int', () => {
        const a = new Int(42);

        expect(a.valueOf()).toEqual(42);
        expect(a instanceof Int).toEqual(true);
        expect(a instanceof Number).toEqual(true);
    });

    it('It should throw an exception', () => {
        expect(() => {
            new Int(42.42);
        }).toThrowError('42.42 isnt an integer');
    });
});
