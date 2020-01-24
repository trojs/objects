# Hack JavaScript objects

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

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
new Obj({
    a: 1,
    b: 2,
    c: [3, 4],
    d: { e: 5, f: 6 },
    g: { h: { i: 7 } }
})
```

The response:
```
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

[npm-url]: https://github.com/hckrnews/objects
[npm-image]: https://img.shields.io/npm/v/objects.svg
[travis-url]: https://travis-ci.org/hckrnews/objects
[travis-image]: https://img.shields.io/travis/hckrnews/objects/master.svg
[coveralls-url]: https://coveralls.io/r/hckrnews/objects
[coveralls-image]: https://img.shields.io/coveralls/hckrnews/objects/master.svg
