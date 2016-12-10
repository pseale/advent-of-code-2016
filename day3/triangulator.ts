import _ = require('lodash')
import color = require('cli-color')

  export function isTriangle(side1 : number, side2 : number, side3 : number) : boolean {
    var sortedSides = _([side1, side2, side3])
      .sortBy(x => x)
      .value()

    var result = sortedSides[0] + sortedSides[1] > sortedSides[2]
    console.log(result ? color.green(sortedSides) : color.red(sortedSides))
    return result
  }
