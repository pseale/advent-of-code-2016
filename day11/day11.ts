import fs = require("fs")
import parse = require("./parse")
import juggler = require("./juggler")
const input = fs.readFileSync("./input.txt", "utf8")

const floors = parse(input)

const startingState = juggler.load(floors)
const solution = juggler.solve(startingState)
console.log(solution)