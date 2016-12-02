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
  var instructions = _(input.split(","))
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

function countBlocks(accumulatedDirections) {
  var directionStrings = _(accumulatedDirections)
    .map(direction => {
      return `${Math.abs(direction.x) + Math.abs(direction.y)} blocks ${getFacingDirection(direction)}`
    })
  
  var netVector = new Victor(0, 0)
  _(accumulatedDirections).each(x => netVector.add(x))
  var totalBlocksString = `${Math.round(Math.abs(netVector.x) + Math.abs(netVector.y))} total blocks`

  return directionStrings.concat(totalBlocksString)
}

function calculateSimplifiedDirections(instructions) {
  var accumulatedDirections = []
  
  var facing = north
  while (instructions.length !== 0) {
    var instruction = instructions.shift()
    facing = turn(facing, instruction.direction)
    accumulatedDirections.push( walk(facing, instruction.blocks) ) 
  }

  return countBlocks(accumulatedDirections)
}

function handle(input) {
  var instructions = parseInput(input)
  return calculateSimplifiedDirections(instructions)
}