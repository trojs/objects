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
```
const flatter = new Obj({
    a: 1,
    b: 2,
    c: [3, 4],
    d: { e: 5, f: 6 },
    g: { h: { i: 7 } }
})
```

You can get the flat object by:
```
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
```
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
```
flatter.keys()

["a", "b", "c.0", "c.1", "d.e", "d.f", "g.h.i"]
```

You can get the object values by:
```
flatter.values()

[1, 2, 3, 4, 5, 6, 7]
```

You can get the object length by:
```
flatter.length

7
```

You can get by key by:
```
flatter.getByKey("g.h.i")

7
```

Or set a fallback value by:
```
flatter.getByKey("x.y.z", 42)

42
```

```
flatter.getByKey("d")

{ e: 5, f: 6 }
```

Check if the object has a key:
```
flatter.has("g.h.i")

true
```

Check if the object has key includes a value:
```
flatter.includes("g.h")

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
