import test from 'node:test'
import assert from 'node:assert'
import { Obj } from '../objects.js'

const ObjectWithoutSchema = Obj()

const TestCases = [
  {
    description: 'Simple object',
    input: {
      a: 1,
      b: 2
    },
    expectedResult: {
      a: 1,
      b: 2
    }
  },
  {
    description: '2 level objects',
    input: {
      a: {
        x: 'test 1',
        y: 'test 2'
      },
      b: {
        x: 'test 3',
        y: 'test 4'
      }
    },
    expectedResult: {
      'a.x': 'test 1',
      'a.y': 'test 2',
      'b.x': 'test 3',
      'b.y': 'test 4'
    }
  },
  {
    description: 'Complext object with multiple levels',
    input: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      g: { h: { i: 7 } }
    },
    expectedResult: {
      a: 1,
      b: 2,
      'c.0': 3,
      'c.1': 4,
      'd.e': 5,
      'd.f': 6,
      'g.h.i': 7
    }
  }
]

test('Test objects.js', async (t) => {
  await Promise.all(
    TestCases.map(async ({ description, input, expectedResult }) => {
      await t.test(description, () => {
        assert.deepEqual(
          ObjectWithoutSchema.create(input).flat,
          expectedResult
        )
      })
    })
  )
})

test('Test objects.js methods', async (t) => {
  await t.test('Get the entries', () => {
    const input = {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      g: { h: { i: 7 } }
    }
    const expectedResult = [
      ['a', 1],
      ['b', 2],
      ['c.0', 3],
      ['c.1', 4],
      ['d.e', 5],
      ['d.f', 6],
      ['g.h.i', 7]
    ]

    assert.deepEqual(
      ObjectWithoutSchema.create(input).entries(),
      expectedResult
    )
  })

  await t.test('Get the keys', () => {
    const input = {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      g: { h: { i: 7 } }
    }
    const expectedResult = ['a', 'b', 'c.0', 'c.1', 'd.e', 'd.f', 'g.h.i']

    assert.deepEqual(
      ObjectWithoutSchema.create(input).keys(),
      expectedResult
    )
  })

  await t.test('Get the values', () => {
    const input = {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      g: { h: { i: 7 } }
    }
    const expectedResult = [1, 2, 3, 4, 5, 6, 7]

    assert.deepEqual(
      ObjectWithoutSchema.create(input).values(),
      expectedResult
    )
  })

  await t.test('Get the length', () => {
    const input = {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      g: { h: { i: 7 } }
    }
    const expectedResult = 7

    assert.strictEqual(
      ObjectWithoutSchema.create(input).length,
      expectedResult
    )
  })
})

const getTestCases = [
  {
    description: 'Key is missing, no defaultValue provided',
    arr: {},
    key: 'pizza',
    expectedValue: undefined
  },
  {
    description: 'Key is missing, a defaultValue is provided',
    arr: {},
    key: 'pizza',
    defaultValue: 'margherita',
    expectedValue: 'margherita'
  },
  {
    description: 'Nested key',
    arr: {
      turtles: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
      food: ['Pizza'],
      mice: ['Splinter']
    },
    key: 'turtles.0',
    expectedValue: 'Donatello'
  },
  {
    description: 'Nested key',
    arr: {
      turtles: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
      food: ['Pizza'],
      mice: ['Splinter']
    },
    key: 'turtles',
    expectedValue: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo']
  },
  {
    description: 'Nested sub keys',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      g: { h: { i: 7 } }
    },
    key: 'd',
    expectedValue: { e: 5, f: 6 }
  },
  {
    description: 'Nested key from flat object',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      'd.e': 5,
      'd.f': 6,
      'g.h.i': 7
    },
    key: 'd',
    expectedValue: { e: 5, f: 6 }
  },
  {
    description: 'Nested key from flat object with an array',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      'd.e': 5,
      'd.f': 6,
      'g.h.i': 7
    },
    key: 'c',
    expectedValue: [3, 4]
  }
]

test('Get value by key', async (t) => {
  await Promise.all(
    getTestCases.map(
      async ({ description, arr, key, defaultValue, expectedValue }) => {
        await t.test(description, () => {
          assert.deepEqual(
            ObjectWithoutSchema.create(arr).getByKey(
              key,
              defaultValue
            ),
            expectedValue
          )
        })
      }
    )
  )
})

const hasTestCases = [
  {
    description: 'Check a key that doesnt exists',
    arr: {},
    key: 'pizza',
    expectedValue: false
  },
  {
    description: 'Simple key check',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    key: 'turtle',
    expectedValue: true
  },
  {
    description: 'Nested key check',
    arr: {
      turtles: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
      food: ['Pizza'],
      mice: ['Splinter']
    },
    key: 'turtles.0',
    expectedValue: true
  }
]

test('Check if the object has a key', async (t) => {
  await Promise.all(
    hasTestCases.map(async ({ description, arr, key, expectedValue }) => {
      await t.test(description, () => {
        assert.deepEqual(
          ObjectWithoutSchema.create(arr).has(key),
          expectedValue
        )
      })
    })
  )
})

const originalHasTestCases = [
  {
    description: 'Check a key that doesnt exists',
    arr: {},
    key: 'pizza',
    expectedValue: false
  },
  {
    description: 'Simple key check',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    key: 'turtle',
    expectedValue: true
  },
  {
    description: 'Nested key check',
    arr: {
      turtles: ['Donatello', 'Michelangelo', 'Raphael', 'Leonardo'],
      food: ['Pizza'],
      mice: ['Splinter']
    },
    key: 'turtles.0',
    expectedValue: false
  }
]

test('Check if the original object has a key', async (t) => {
  await Promise.all(
    originalHasTestCases.map(
      async ({ description, arr, key, expectedValue }) => {
        await t.test(description, () => {
          assert.deepEqual(
            ObjectWithoutSchema.create(arr).originalHas(key),
            expectedValue
          )
        })
      }
    )
  )
})

const getKeysTestCases = [
  {
    description: 'Check if we can a single keys',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['turtle'],
    expectedValue: {
      turtle: 'Leonardo'
    }
  },
  {
    description: 'Check if we can get multiple keys',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['food', 'mice'],
    expectedValue: {
      food: 'Pizza',
      mice: 'Splinter'
    }
  },
  {
    description: 'Check if we only get existing keys',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['food', 'drink'],
    defaultValue: {
      result: 'ok'
    },
    expectedValue: {
      food: 'Pizza'
    }
  },
  {
    description: 'Check if we get an empty object if no keys exist',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['drink'],
    expectedValue: undefined
  },
  {
    description: 'Check if we get the default value if no keys exists',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['drink'],
    defaultValue: {
      result: 'ok'
    },
    expectedValue: {
      result: 'ok'
    }
  },
  {
    description: 'Check if we get deep nested keys',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      g: { h: { i: 7 } }
    },
    keys: ['a', 'c', 'd.e', 'g.h'],
    expectedValue: {
      a: 1,
      c: [3, 4],
      'd.e': 5,
      'g.h': { i: 7 }
    }
  },
  {
    description: 'Check if we get items with a false value',
    arr: {
      a: true,
      b: false,
      c: 0,
      d: ''
    },
    keys: ['a', 'b', 'c', 'd', 'e'],
    expectedValue: {
      a: true,
      b: false,
      c: 0,
      d: ''
    }
  }
]

test('Check if the object has the keys', async (t) => {
  await Promise.all(
    getKeysTestCases.map(
      async ({ description, arr, keys, defaultValue, expectedValue }) => {
        await t.test(description, () => {
          assert.deepEqual(
            ObjectWithoutSchema.create(arr).getKeys(
              keys,
              defaultValue
            ),
            expectedValue
          )
        })
      }
    )
  )
})

const getFlatKeysTestCases = [
  {
    description: 'Check if we can a single keys (flat)',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['turtle'],
    expectedValue: {
      turtle: 'Leonardo'
    }
  },
  {
    description: 'Check if we can get multiple keys (flat)',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['food', 'mice'],
    expectedValue: {
      food: 'Pizza',
      mice: 'Splinter'
    }
  },
  {
    description: 'Check if we only get existing keys (flat)',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['food', 'drink'],
    defaultValue: {
      result: 'ok'
    },
    expectedValue: {
      food: 'Pizza'
    }
  },
  {
    description: 'Check if we get an empty object if no keys exist (flat)',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['drink'],
    expectedValue: undefined
  },
  {
    description: 'Check if we get the default value if no keys exists (flat)',
    arr: {
      turtle: 'Leonardo',
      food: 'Pizza',
      mice: 'Splinter'
    },
    keys: ['drink'],
    defaultValue: {
      result: 'ok'
    },
    expectedValue: {
      result: 'ok'
    }
  },
  {
    description: 'Check if we get deep nested keys (flat)',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      g: { h: { i: 7 } }
    },
    keys: ['a', 'c', 'd.e', 'g.h'],
    expectedValue: {
      a: 1,
      'c.0': 3,
      'c.1': 4,
      'd.e': 5,
      'g.h.i': 7
    }
  }
]

test('Check if the object has the keys (flat)', async (t) => {
  await Promise.all(
    getFlatKeysTestCases.map(
      async ({ description, arr, keys, defaultValue, expectedValue }) => {
        await t.test(description, () => {
          assert.deepEqual(
            ObjectWithoutSchema.create(arr).getFlatKeys(
              keys,
              defaultValue
            ),
            expectedValue
          )
        })
      }
    )
  )
})

const includesTestCases = [
  {
    description: 'Check if the array includes a key',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      test: { second: { third: 7 } }
    },
    key: 'a',
    expectedValue: true
  },
  {
    description: 'Check if the array includes a sub key',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      test: { second: { third: 7 } }
    },
    key: 'd.e',
    expectedValue: true
  },
  {
    description: 'Check if the array doesnt includes a key',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      test: { second: { third: 7 } }
    },
    key: 'd.g',
    expectedValue: false
  },
  {
    description: 'Check if the array includes a part of a key',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      test: { second: { third: 7 } }
    },
    key: 'tes',
    expectedValue: true
  },
  {
    description: 'Check if the array includes a part of a sub key',
    arr: {
      a: 1,
      b: 2,
      c: [3, 4],
      d: { e: 5, f: 6 },
      test: { second: { third: 7 } }
    },
    key: 'test.sec',
    expectedValue: true
  }
]

test('Check if the object includes a key', async (t) => {
  await Promise.all(
    includesTestCases.map(
      async ({ description, arr, key, expectedValue }) => {
        await t.test(description, () => {
          assert.deepEqual(
            ObjectWithoutSchema.create(arr).includes(key),
            expectedValue
          )
        })
      }
    )
  )
})
