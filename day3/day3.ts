import _ = require("lodash")
import triangulator = require("./triangulator")

import input = require("./input")

var results = _(input.parsedInput).map(x => triangulator.isTriangle(x.side1, x.side2, x.side3)).value()

var numberOfTriangles = _(results).filter(x => x === true).value().length
console.log(`Triangles: ${numberOfTriangles}`)
