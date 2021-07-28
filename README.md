# Create valid JavaScript objects

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Scrutinizer Code Quality][scrutinizer-image]][scrutinizer-url]

Create objects and validate the values, so you know all values are ok.
You don't have to create code to validate all fields of an object, just write a schema.
Also get more usefull methods to work with objects.

## Installation

`npm install @hckrnews/objects`
or
`yarn add @hckrnews/objects`

## Test the package

`npm run test`
or
`yarn test`

## Validation

For validate the objects, it use the package `@hckrnews/validation` (https://www.npmjs.com/package/@hckrnews/validator)
It will throw an error if the object isnt valid.
For all posibilities, check the validation package readme.

## Usage

Example usage:
```javascript
import Obj from '@hckrnews/objects'

const addressSchema = {
    street: String,
    number: Number,
    postalCode: String,
    city: String,
    country: String,
};

const Address = Obj({ schema: addressSchema })

const myAddress = Address.create({
    street: 'Abc',
    number: 42,
    postalCode: '1234AB',
    city: 'Example',
    country: 'The Netherlands'
})

console.log(myAddress)

{
    street: 'Abc',
    number: 42,
    postalCode: '1234AB',
    city: 'Example',
    country: 'The Netherlands'
}
```

You can also define sub schemas:

```javascript
import Obj from '@hckrnews/objects'

const filterSchema = {
  key: String,
  type: String
}

const optionSchema = {
  value: String,
  'count?': Number
}

const selectFilterSchema = {
  ...filterSchema,
  options: optionSchema
}

const SelectFilter = Obj({ schema: selectFilterSchema })

const multiselect = SelectFilter.create({
    key: 'status',
    type: 'multiselect',
    options: [
        {
            value: 'open',
            count: 42
        },
        {
            value: 'closed'
        }
    ]
})

console.log(multiselect)

{
    street: 'status',
    number: 'multiselect',
    options: [
        {
            value: 'open',
            count: 42
        },
        {
            value: 'closed'
        }
    ]
}
```

Catching validation errors:

```javascript
try {
    const multiselect = SelectFilter.create({
        key: 'status',
        options: [
            {
                value: 'open',
                count: 42
            },
            {
                value: 'closed'
            }
        ]
    })
} catch (error) {
    console.log(error.message)
}

'The field type should be a String'
```

You can also map the values:
```javascript
const testSchema = {
    a: Number,
    b: Number,
};

const Test = Obj({ schema: testSchema });

const input = {
    a: 1,
    b: 2,
};

const test = Test.create(input)

const mappedResults = test.map((x) => x * 2)

// Or you can do:
const double = (x) => x * 2
const mappedResults2 = test.map(double)

console.log(mappedResults)

{
    a: 2,
    b: 4,
};
```

You can also filter the values:
```javascript
const testSchema = {
    a: Number,
    b: Number,
};

const Test = Obj({ schema: testSchema });

const input = {
    a: 1,
    b: 2,
};

const test = Test.create(input)

const filteredResults = test.filter((x) => x === 1)

// Or you can do:
const onlyOne = (x) => x === 1
const filteredResults2 = test.filter(onlyOne)

console.log(filteredResults)

{
    a: 1,
};
```

You can also use every:
```javascript
const testSchema = {
    a: Number,
    b: Number,
};

const Test = Obj({ schema: testSchema });

const input = {
    a: 1,
    b: 2,
};

const test = Test.create(input)

const everythingIsBelowThree = test.every((x) => x < 3)

// Or you can do:
const isBelowThree = (x) => x < 3
const everythingIsBelowThree2 = test.every(isBelowThree)

console.log(everythingIsBelowThree)

true
```

You can also use some:
```javascript
const testSchema = {
    a: Number,
    b: Number,
};

const Test = Obj({ schema: testSchema });

const input = {
    a: 1,
    b: 2,
};

const test = Test.create(input)

const someAreTwo = test.some((x) => x === 2)

// Or you can do:
const isTwo = (x) => x === 2
const someAreTwo2 = test.some(isTwo)

console.log(someAreTwo)

true
```

If you have some data, and you have to transform the data to the schema, you can use the parse method.
```javascript
const subSchema = {
    a: Number,
    b: Boolean,
    'c?': String,
};

const testSchema = {
    a: Number,
    b: Boolean,
    'c?': String,
    subSchema,
};

const Test = Obj({ schema: testSchema });


const input = {
    a: '42',
    b: 'true',
    c: 42,
    subSchema: {
        a: '42',
        b: 'true',
        c: 42,
    },
};

Test.parse(input)

{
    a: 42,
    b: true,
    c: '42',
    subSchema: {
        a: 42,
        b: true,
        c: '42',
    },
};
```

Example usage without a schema:
...

```javascript
const flatter = Obj().create({
    a: 1,
    b: 2,
    c: [3, 4],
    d: { e: 5, f: 6 },
    g: { h: { i: 7 } }
})
```

You can get the flat object by:
```javascript
flatter.flat

{
    a: 1,
    b: 2,
    "c.0": 3,
    "c.1": 4,
    "d.e": 5,
    "d.f": 6,
    "g.h.i": 7
}
```

You can get the object entries by:
```javascript
flatter.entries()

[
    ["a", 1],
    ["b", 2],
    ["c.0", 3],
    ["c.1", 4],
    ["d.e", 5],
    ["d.f", 6],
    ["g.h.i", 7]
]
```

You can get the object keys by:
```javascript
flatter.keys()

["a", "b", "c.0", "c.1", "d.e", "d.f", "g.h.i"]
```

You can get the object values by:
```javascript
flatter.values()

[1, 2, 3, 4, 5, 6, 7]
```

You can get the object length by:
```javascript
flatter.length

7
```

You can get by key by:
```javascript
flatter.getByKey("g.h.i")

7
```

Or set a fallback value by:
```javascript
flatter.getByKey("x.y.z", 42)

42
```

```javascript
flatter.getByKey("d")

{ e: 5, f: 6 }
```

Check if the object has a key:
```javascript
flatter.has("g.h.i")

true
```

Check if the object has key includes a value:
```javascript
flatter.includes("g.h")

true
```

You can get only some fields from the object:
```javascript
flatter.getKeys(['a', 'c', 'd.e', 'g.h'])

{
    a: 1,
    c: [3, 4],
    'd.e': 5,
    'g.h': { i: 7 },
}
```

And you can also get some fields from the object in the flat format:
```javascript
flatter.getFlatKeys(['a', 'c', 'd.e', 'g.h'])

{
    a: 1,
    'c.0': 3,
    'c.1': 4,
    'd.e': 5,
    'g.h.i': 7,
}
```

And you can also use the map method:
```javascript

flatter.flatMap((x) => x * 2)

{
    a: 2,
    b: 4,
    'c.0': 6,
    'c.1': 8,
    'd.e': 10,
    'd.f': 12,
    'g.h.i': 14,
};
```

And you can also use the flatFilter method:
```javascript
const flatter = Obj().create({
    a: 1,
    b: 2,
    c: [1, 2],
    d: { e: 1, f: 2 },
    g: { h: { i: 1 } }
})

flatter.flatFilter((x) => x === 1)

{
    a: 1,
    'c.0': 1,
    'd.e': 1,
    'g.h.i': 1,
};
```

And you can also use the flatEvery method:
```javascript
const flatter = Obj().create({
    a: 1,
    b: 2,
    c: [1, 2],
    d: { e: 1, f: 2 },
    g: { h: { i: 1 } }
})

flatter.flatEvery((x) => x < 3)

true
```

And you can also use the flatSome method:
```javascript
const flatter = Obj().create({
    a: 1,
    b: 2,
    c: [1, 2],
    d: { e: 1, f: 2 },
    g: { h: { i: 1 } }
})

flatter.flatSome((x) => x === 2)

true
```

[npm-url]: https://www.npmjs.com/package/@hckrnews/objects
[npm-image]: https://img.shields.io/npm/v/@hckrnews/objects.svg
[travis-url]: https://travis-ci.org/hckrnews/objects
[travis-image]: https://img.shields.io/travis/hckrnews/objects/master.svg
[coveralls-url]: https://coveralls.io/r/hckrnews/objects
[coveralls-image]: https://img.shields.io/coveralls/hckrnews/objects/master.svg
[scrutinizer-url]: https://scrutinizer-ci.com/g/hckrnews/objects/?branch=master
[scrutinizer-image]: https://scrutinizer-ci.com/g/hckrnews/objects/badges/quality-score.png?b=master
