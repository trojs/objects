# Hack JavaScript objects

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Scrutinizer Code Quality][scrutinizer-image]][scrutinizer-url]

Get a flat version of the object

## Installation

`npm install @hckrnews/objects`
or
`yarn add @hckrnews/objects`

## Test the package

`npm run test`
or
`yarn test`

## Usage

Example usage:
```javascript
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
```

Example usage without a schema:
...

```javascript
const ObjectWithoutSchema = Obj()
const flatter = ObjectWithoutSchema.create({
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

[npm-url]: https://www.npmjs.com/package/@hckrnews/objects
[npm-image]: https://img.shields.io/npm/v/@hckrnews/objects.svg
[travis-url]: https://travis-ci.org/hckrnews/objects
[travis-image]: https://img.shields.io/travis/hckrnews/objects/master.svg
[coveralls-url]: https://coveralls.io/r/hckrnews/objects
[coveralls-image]: https://img.shields.io/coveralls/hckrnews/objects/master.svg
[scrutinizer-url]: https://scrutinizer-ci.com/g/hckrnews/objects/?branch=master
[scrutinizer-image]: https://scrutinizer-ci.com/g/hckrnews/objects/badges/quality-score.png?b=master
