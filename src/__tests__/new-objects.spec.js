import { expect, describe, it } from '@jest/globals';
import Obj from '../objects';

const ObjectWithoutSchema = Obj();

const TestCases = [
    {
        description: 'Simple object',
        input: {
            a: 1,
            b: 2,
        },
        expectedResult: {
            a: 1,
            b: 2,
        },
    },
    {
        description: '2 level objects',
        input: {
            a: {
                x: 'test 1',
                y: 'test 2',
            },
            b: {
                x: 'test 3',
                y: 'test 4',
            },
        },
        expectedResult: {
            'a.x': 'test 1',
            'a.y': 'test 2',
            'b.x': 'test 3',
            'b.y': 'test 4',
        },
    },
    {
        description: 'Complext object with multiple levels',
        input: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        },
        expectedResult: {
            a: 1,
            b: 2,
            'c.0': 3,
            'c.1': 4,
            'd.e': 5,
            'd.f': 6,
            'g.h.i': 7,
        },
    },
];

describe.each(TestCases)(
    'Test objects.js',
    ({ description, input, expectedResult }) => {
        it(description, () => {
            expect(ObjectWithoutSchema.create(input).flat).toMatchObject(
                expectedResult
            );
        });
    }
);

describe('Test objects.js methods', () => {
    it('Get the entries', () => {
        const input = {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        };
        const expectedResult = [
            ['a', 1],
            ['b', 2],
            ['c.0', 3],
            ['c.1', 4],
            ['d.e', 5],
            ['d.f', 6],
            ['g.h.i', 7],
        ];

        expect(ObjectWithoutSchema.create(input).entries()).toMatchObject(
            expectedResult
        );
    });

    it('Get the keys', () => {
        const input = {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        };
        const expectedResult = ['a', 'b', 'c.0', 'c.1', 'd.e', 'd.f', 'g.h.i'];

        expect(ObjectWithoutSchema.create(input).keys()).toMatchObject(
            expectedResult
        );
    });

    it('Get the values', () => {
        const input = {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        };
        const expectedResult = [1, 2, 3, 4, 5, 6, 7];

        expect(ObjectWithoutSchema.create(input).values()).toMatchObject(
            expectedResult
        );
    });

    it('Get the length', () => {
        const input = {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        };
        const expectedResult = 7;

        expect(ObjectWithoutSchema.create(input).length).toBe(expectedResult);
    });
});

const getTestCases = [
    {
        description: 'Key is missing, no defaultValue provided',
        arr: {},
        key: 'pizza',
        expectedValue: undefined,
    },
    {
        description: 'Key is missing, a defaultValue is provided',
        arr: {},
        key: 'pizza',
        defaultValue: 'margherita',
        expectedValue: 'margherita',
    },
    {
        description: 'Nested key',
        arr: {
            turtles: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
            food: ['Pizza'],
            mice: ['Splinter'],
        },
        key: 'turtles.0',
        expectedValue: 'Donatello',
    },
    {
        description: 'Nested key',
        arr: {
            turtles: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
            food: ['Pizza'],
            mice: ['Splinter'],
        },
        key: 'turtles',
        expectedValue: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
    },
    {
        description: 'Nested sub keys',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        },
        key: 'd',
        expectedValue: { e: 5, f: 6 },
    },
    {
        description: 'Nested key from flat object',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            'd.e': 5,
            'd.f': 6,
            'g.h.i': 7,
        },
        key: 'd',
        expectedValue: { e: 5, f: 6 },
    },
    {
        description: 'Nested key from flat object with an array',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            'd.e': 5,
            'd.f': 6,
            'g.h.i': 7,
        },
        key: 'c',
        expectedValue: [3, 4],
    },
];

describe.each(getTestCases)(
    'Get value by key',
    ({ description, arr, key, defaultValue, expectedValue }) => {
        it(description, () => {
            expect(
                ObjectWithoutSchema.create(arr).getByKey(key, defaultValue)
            ).toEqual(expectedValue);
        });
    }
);

const hasTestCases = [
    {
        description: 'Check a key that doesnt exists',
        arr: {},
        key: 'pizza',
        expectedValue: false,
    },
    {
        description: 'Simple key check',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        key: 'turtle',
        expectedValue: true,
    },
    {
        description: 'Nested key check',
        arr: {
            turtles: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
            food: ['Pizza'],
            mice: ['Splinter'],
        },
        key: 'turtles.0',
        expectedValue: true,
    },
];

describe.each(hasTestCases)(
    'Check if the object has a key',
    ({ description, arr, key, expectedValue }) => {
        it(description, () => {
            expect(ObjectWithoutSchema.create(arr).has(key)).toEqual(
                expectedValue
            );
        });
    }
);

const originalHasTestCases = [
    {
        description: 'Check a key that doesnt exists',
        arr: {},
        key: 'pizza',
        expectedValue: false,
    },
    {
        description: 'Simple key check',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        key: 'turtle',
        expectedValue: true,
    },
    {
        description: 'Nested key check',
        arr: {
            turtles: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
            food: ['Pizza'],
            mice: ['Splinter'],
        },
        key: 'turtles.0',
        expectedValue: false,
    },
];

describe.each(originalHasTestCases)(
    'Check if the original object has a key',
    ({ description, arr, key, expectedValue }) => {
        it(description, () => {
            expect(ObjectWithoutSchema.create(arr).originalHas(key)).toEqual(
                expectedValue
            );
        });
    }
);

const getKeysTestCases = [
    {
        description: 'Check if we can a single keys',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['turtle'],
        expectedValue: {
            turtle: 'Leonardo',
        },
    },
    {
        description: 'Check if we can get multiple keys',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['food', 'mice'],
        expectedValue: {
            food: 'Pizza',
            mice: 'Splinter',
        },
    },
    {
        description: 'Check if we only get existing keys',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['food', 'drink'],
        defaultValue: {
            result: 'ok',
        },
        expectedValue: {
            food: 'Pizza',
        },
    },
    {
        description: 'Check if we get an empty object if no keys exist',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['drink'],
        expectedValue: undefined,
    },
    {
        description: 'Check if we get the default value if no keys exists',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['drink'],
        defaultValue: {
            result: 'ok',
        },
        expectedValue: {
            result: 'ok',
        },
    },
    {
        description: 'Check if we get deep nested keys',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        },
        keys: ['a', 'c', 'd.e', 'g.h'],
        expectedValue: {
            a: 1,
            c: [3, 4],
            'd.e': 5,
            'g.h': { i: 7 },
        },
    },
];

describe.each(getKeysTestCases)(
    'Check if the object has the keys',
    ({ description, arr, keys, defaultValue, expectedValue }) => {
        it(description, () => {
            expect(
                ObjectWithoutSchema.create(arr).getKeys(keys, defaultValue)
            ).toEqual(expectedValue);
        });
    }
);

const getFlatKeysTestCases = [
    {
        description: 'Check if we can a single keys',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['turtle'],
        expectedValue: {
            turtle: 'Leonardo',
        },
    },
    {
        description: 'Check if we can get multiple keys',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['food', 'mice'],
        expectedValue: {
            food: 'Pizza',
            mice: 'Splinter',
        },
    },
    {
        description: 'Check if we only get existing keys',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['food', 'drink'],
        defaultValue: {
            result: 'ok',
        },
        expectedValue: {
            food: 'Pizza',
        },
    },
    {
        description: 'Check if we get an empty object if no keys exist',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['drink'],
        expectedValue: undefined,
    },
    {
        description: 'Check if we get the default value if no keys exists',
        arr: {
            turtle: 'Leonardo',
            food: 'Pizza',
            mice: 'Splinter',
        },
        keys: ['drink'],
        defaultValue: {
            result: 'ok',
        },
        expectedValue: {
            result: 'ok',
        },
    },
    {
        description: 'Check if we get deep nested keys',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            g: { h: { i: 7 } },
        },
        keys: ['a', 'c', 'd.e', 'g.h'],
        expectedValue: {
            a: 1,
            'c.0': 3,
            'c.1': 4,
            'd.e': 5,
            'g.h.i': 7,
        },
    },
];

describe.each(getFlatKeysTestCases)(
    'Check if the object has the keys (flat)',
    ({ description, arr, keys, defaultValue, expectedValue }) => {
        it(description, () => {
            expect(
                ObjectWithoutSchema.create(arr).getFlatKeys(keys, defaultValue)
            ).toEqual(expectedValue);
        });
    }
);

const includesTestCases = [
    {
        description: 'Check if the array includes a key',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            test: { second: { third: 7 } },
        },
        key: 'a',
        expectedValue: true,
    },
    {
        description: 'Check if the array includes a sub key',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            test: { second: { third: 7 } },
        },
        key: 'd.e',
        expectedValue: true,
    },
    {
        description: 'Check if the array doesnt includes a key',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            test: { second: { third: 7 } },
        },
        key: 'd.g',
        expectedValue: false,
    },
    {
        description: 'Check if the array includes a part of a key',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            test: { second: { third: 7 } },
        },
        key: 'tes',
        expectedValue: true,
    },
    {
        description: 'Check if the array includes a part of a sub key',
        arr: {
            a: 1,
            b: 2,
            c: [3, 4],
            d: { e: 5, f: 6 },
            test: { second: { third: 7 } },
        },
        key: 'test.sec',
        expectedValue: true,
    },
];

describe.each(includesTestCases)(
    'Check if the object includes a key',
    ({ description, arr, key, expectedValue }) => {
        it(description, () => {
            expect(ObjectWithoutSchema.create(arr).includes(key)).toEqual(
                expectedValue
            );
        });
    }
);
