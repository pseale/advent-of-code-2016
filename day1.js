"use strict";

//north is y+, south is y-
//west is x-, east is x+
const north = new Victor(0, -1)
const south = new Victor(0,  1)
const  west = new Victor(-1, 0)
const  east = new Victor(1,  0)

const left = "L"
const right = "R"

function parseSingleInput(input) {
  var trimmedInput = input.trim()
  var directionString = trimmedInput.substring(0, 1).toUpperCase()
  var blocksString = trimmedInput.substring(1)

  if (directionString !== left && directionString !== right) {
    throw `Cannot parse input '${input}' - expected the direction to be either L (left) or R (right)`
  }

  var blocks = Number(blocksString)

  if (isNaN(blocks)) {
    throw `Cannot parse input '${input}' - expected a number of blocks to precede the direction, but '${blocks}' is not a number.`
  }

  if (Math.floor(blocks) !== blocks) {
    throw `Cannot parse input '${input}' - expected a number of blocks in whole numbers only, but '${blocks}' is not a whole number.`
  }
  return {
    direction: directionString,
    blocks
  }
}

function parseInput(input) {
  let instructions = _(input.split(","))
    .each(x => x.trim())
    .filter(x => x)  //is not empty or null
    .map(x => parseSingleInput(x));

  if (_.isEmpty(instructions)) {
    throw `Cannot parse input '${input}' - found no instructions in it.`
  }

  return instructions
}

function turn(facing, turnDirection) {
  if (turnDirection === left) {
    return round( facing.clone().rotateDeg(-90) )
  } else {
    return round( facing.clone().rotateDeg(90) )
  }
}

function walk(facing, blocks) {
  var clone = facing.clone()
  return round( clone.multiply(new Victor(blocks, blocks)) )
}

function round(vector) {
  return new Victor(Math.round(vector.x), Math.round(vector.y))
}

function getFacingDirection(vector) {
  if (vector.y < 0) {
    return "north"
  }

  if (vector.y > 0) {
    return "south"
  }

  if (vector.x < 0) {
    return "west"
  }

  if (vector.x > 0) {
    return "east"
  }

  throw `Error determining direction for vector [x:${vector.x} y:${vector.y}]`
}

function countBlocks(directions) {
  var directionStrings = _(directions)
    .map(direction => {
      return `${Math.abs(direction.x) + Math.abs(direction.y)} blocks ${getFacingDirection(direction)}`
    })
  
  var netVector = new Victor(0, 0)
  _(directions).each(x => netVector.add(x))
  var totalBlocksString = `${Math.round(Math.abs(netVector.x) + Math.abs(netVector.y))} total blocks`

  return directionStrings.concat(totalBlocksString)
}

function whereAmI(directions) {
  var netVector = new Victor(0, 0)
  _(directions).each(x => netVector.add(x)) //change to _.reduce()
  return new Victor(Math.round(netVector.x), Math.round(netVector.y))
}

function calculateSimplifiedDirections(instructions) {
  var directions = []
  var locations = []

  var facing = north
  var order = 1
  var startLocation = new Victor(0, 0)
  while (instructions.length !== 0) {
    var instruction = instructions.shift()
    facing = turn(facing, instruction.direction)
    
    var direction = walk(facing, instruction.blocks)

    var endLocation = whereAmI(directions.concat(direction))
    locations.push({ order: order, startLocation: startLocation, endLocation: endLocation })
    directions.push(direction)
   
    order++
    startLocation = endLocation
  }

  return locations
}

function calculateEarliestRepeatVisit(visits) {
  if (visits.length <= 1) {
    return -1
  }

  var firstVisit = _.min(visits)
  var remainingVisits = _(visits).difference( [firstVisit] )

  return _(remainingVisits).min()
}

function calculateNewlyVisitedBlocks(start, end) {
  if (start < end) {
    return _.range(start, end)
  }

  if (start > end) {
    return _.range(start, end)
  }
}

function calculateIntersectionsVisited(direction) {
  if (direction.startLocation.x !== direction.endLocation.x) {
    var blocksX = calculateNewlyVisitedBlocks(direction.startLocation.x, direction.endLocation.x)
    return _(blocksX).map(x => {
      return {
        order: direction.order,
        intersection: new Victor(x, direction.startLocation.y),
        intersectionString: new Victor(x, direction.startLocation.y).toString()
      }
    }).value()
  }

  if (direction.startLocation.y !== direction.endLocation.y) {
    var blocksY = calculateNewlyVisitedBlocks(direction.startLocation.y, direction.endLocation.y)
    return _(blocksY).map(y => {
      return {
        order: direction.order,
        intersection: new Victor(direction.startLocation.x, y),
        intersectionString: new Victor(direction.startLocation.x, y).toString()
      }
    }).value()
  }

  throw `Could not determine which direction traveled from ${direction.startLocation.toString()} to ${direction.endLocation.toString()}`
}

function calculateVisitsToLocations(directions) {
  var intersectionsVisited = _(directions)
    .map(x => calculateIntersectionsVisited(x))
    .flatten()
    .value()

  var intersectionGroups = _.groupBy(intersectionsVisited, "intersectionString")  

  var intersectionsWithEarliestVisits = _(Object.values(intersectionGroups))
    .map(x => {
      return {
        count: x.length,
        earliestRepeatVisit: calculateEarliestRepeatVisit(_(x).map(y => y.order).value()),
        intersection: x[0].intersection
      }
    })
    .filter(x => x.count >= 2)
    .sortBy(x => x.earliestRepeatVisit)
    .value()

  return intersectionsWithEarliestVisits;
}

function handle(input) {
  let instructions = parseInput(input)
  let directions = calculateSimplifiedDirections(instructions)
  let locationsAndVisits = calculateVisitsToLocations(directions)
  if (locationsAndVisits.length === 0) {
    return "No locations were visited twice"
  }

  let intersection = locationsAndVisits[0].intersection
  var blocksCount = Math.round(Math.abs(intersection.x) + Math.abs(intersection.y))

  return `First intersection was revisited at leg# ${locationsAndVisits[0].earliestRepeatVisit} at ${intersection.toString()} - ${blocksCount} blocks away.`
}