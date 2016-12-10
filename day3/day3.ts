import _ = require("lodash")
import triangulator = require("./triangulator")
import color = require('cli-color')

import input = require("./input")

var results = _(input.parseInputForPartA()).map(x => triangulator.isTriangle(x.side1, x.side2, x.side3)).value()

_(results).each(x =>  console.log(x.isLegalTriangle ? color.green([x.side1, x.side2, x.side3]) : color.red([x.side1, x.side2, x.side3])))


var numberOfTriangles = _(results).filter(x => x.isLegalTriangle === true).value().length
console.log(`Triangles: ${numberOfTriangles}`)
