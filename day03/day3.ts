import _ = require("lodash")
import triangulator = require("./triangulator")
import color = require('cli-color')

import input = require("./input")

var partAResults = _(input.parseInputForPartA()).map(x => triangulator.isTriangle(x.side1, x.side2, x.side3)).value()
var partBResults = _(input.parseInputForPartB()).map(x => triangulator.isTriangle(x.side1, x.side2, x.side3)).value()

console.log("~~~~~~")
console.log("PART A")
console.log("~~~~~~")
_(partAResults).each(x =>   console.log(x.isLegalTriangle ? color.green([x.side1, x.side2, x.side3]) : color.red([x.side1, x.side2, x.side3])))

console.log("\n\n~~~~~~")
console.log("PART B")
console.log("~~~~~~")
_(partBResults).each(x =>   console.log(x.isLegalTriangle ? color.green([x.side1, x.side2, x.side3]) : color.red([x.side1, x.side2, x.side3])))


var numberOfTrianglesPartA = _(partAResults).filter(x => x.isLegalTriangle === true).value().length
console.log(`Part A Triangles: ${numberOfTrianglesPartA}`)

var numberOfTrianglesPartB = _(partBResults).filter(x => x.isLegalTriangle === true).value().length
console.log(`Part B Triangles: ${numberOfTrianglesPartB}`)
