import fs = require("fs")
import _ = require("lodash")
import parse = require("./parse")
import decode = require("./decode")

const input = fs.readFileSync("./input.txt", "utf8")
const columns = parse(input)
const decoded = decode(columns)

console.log(`Part A: decoded word is ${decoded.mostFrequent}`)
console.log(`Part B: decoded word is ${decoded.leastFrequent}`)
