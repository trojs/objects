 
import test from 'node:test'
import assert from 'node:assert'
import Int from '../int.js'

test('Test int.js', async (t) => {
    await t.test('It should build a int', () => {
        const a = new Int(42)

        assert.strictEqual(a.valueOf(), 42)
        assert.strictEqual(a instanceof Int, true)
        assert.strictEqual(a instanceof Number, true)
    })

    await t.test('It should throw an exception', () => {
        try {
            new Int(42.42)
        } catch (error) {
            assert.strictEqual(error.message, '42.42 isnt an integer')
        }
    })
})
