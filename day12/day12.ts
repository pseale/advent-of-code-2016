import fs = require("fs")
import Global = require("./global")
import parse = require("./parse")
import run = require("./run")

const input = fs.readFileSync("./input.txt", "utf8")

const instructions = parse(input)
console.log("Part A:")
run(instructions, Global.InitType.a)
console.log("\n\n\n")
console.log("Part B:")
run(instructions, Global.InitType.b)
