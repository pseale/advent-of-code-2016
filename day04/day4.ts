import fs = require("fs");
import _ = require("lodash")
import parse = require("./parser")
import checker = require("./checker")
import decrypt = require("./decrypt")


var input = fs.readFileSync("./input.txt", "utf8")
var rooms = parse(input)
var results = _(rooms).map(x => checker.check(x)).value()

var legalRooms = _(results).filter(x => x.legal === true).value().length
var sum = _(results).filter(x => x.legal === true).map(x => x.sectorId).sum()

var partBResults = _(results)
  .filter(x => x.legal === true)
  .map(x => decrypt(x))
  .value()
var possibleNorthPoleObjectStorageLocations = _(partBResults).filter(x => /north/.exec(x.name) && /pole/.exec(x.name) ).value()

console.log(`Part A: Sum: ${sum} of ${legalRooms} legal rooms (of ${rooms.length} total)`)
console.log(`Part B: all possible north pole locations: `, possibleNorthPoleObjectStorageLocations)