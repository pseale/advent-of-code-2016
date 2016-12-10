import _ = require('lodash')
import color = require('cli-color')

interface TriangleMeasurement {
  side1: number,
  side2: number,
  side3: number,
  isLegalTriangle: boolean
}


export function isTriangle(side1 : number, side2 : number, side3 : number) : TriangleMeasurement {
  var sortedSides = _([side1, side2, side3])
    .sortBy(x => x)
    .value()

  var isLegalTriangle = sortedSides[0] + sortedSides[1] > sortedSides[2]
  return { side1, side2, side3, isLegalTriangle }
}
