import Obj from '../../src/objects';

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
            expect(new Obj(input).flat).toMatchObject(expectedResult);
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

        expect(new Obj(input).entries()).toMatchObject(expectedResult);
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

        expect(new Obj(input).keys()).toMatchObject(expectedResult);
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

        expect(new Obj(input).values()).toMatchObject(expectedResult);
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

        expect(new Obj(input).length).toBe(expectedResult);
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
];

describe.each(getTestCases)(
    'Get value by key',
    ({ description, arr, key, defaultValue, expectedValue }) => {
        it(description, () => {
            expect(new Obj(arr).getByKey(key, defaultValue)).toEqual(
                expectedValue
            );
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
            expect(new Obj(arr).has(key)).toEqual(
                expectedValue
            );
        });
    }
);
