import fs = require("fs")
import Factory = require("./factory")
import parse = require("./parse")

const input = fs.readFileSync("./input.txt", "utf8")

const events = parse(input)

const factory = new Factory()
events.forEach(event => factory.process(event))
