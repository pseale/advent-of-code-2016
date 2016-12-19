import fs = require("fs")
import parseA = require("./parseA")
import count = require("./count")

const input = fs.readFileSync("./input.txt", "utf8")
  .split("\n")
  .map(x => x.trim())
  .filter(x => x !== "")

const partACount = input
  .map(line => parseA(line))
  .reduce((previousValue, currentValue) => previousValue + currentValue.length, 0)

const partBCount = input
  .map(line => count(line))
  .reduce((previousValue, currentValue) => previousValue + currentValue, 0)

console.log(`Part A: total count of uncompressed data is ${partACount} for ${input.length} lines`)
console.log(`Part B: total count of uncompressed data is ${partBCount} for ${input.length} lines`)
