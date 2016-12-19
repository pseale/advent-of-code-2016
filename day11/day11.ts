import fs = require("fs")
import parse = require("./parse")

const input = fs.readFileSync("./input.txt", "utf8")

const floors = parse(input)

console.log(floors)
