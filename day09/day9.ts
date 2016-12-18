import fs = require("fs")
import parse = require("./parse")

const input = fs.readFileSync("./input.txt", "utf8")
  .split("\n")
  .map(x => x.trim())
  .filter(x => x !== "")

const count = input
  .map(line => parse(line))
  .reduce((previousValue, currentValue) => previousValue + currentValue.length, 0)

console.log(`Part A: total count of uncompressed data is ${count} for ${input.length} lines`)
