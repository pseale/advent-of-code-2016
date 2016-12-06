var _ = require("lodash")

var constants = {
  up: "U",
  down: "D",
  left: "L",
  right: "R"
}

function wireUpKey(wiring) {
  var doNotMove = wiring.key
  wiring.key.moveUp = () => wiring.up || doNotMove
  wiring.key.moveDown = () => wiring.down || doNotMove
  wiring.key.moveLeft = () => wiring.left || doNotMove
  wiring.key.moveRight = () => wiring.right || doNotMove
}

function createKeysForPartA() {
  var one = { position: 1 }
  var two = { position: 2 }
  var three = { position: 3 }
  var four = { position: 4 }
  var five = { position: 5 }
  var six = { position: 6 }
  var seven = { position: 7 }
  var eight = { position: 8 }
  var nine = { position: 9 }

  wireUpKey({
    key: one,
    right: two,
    down: four
  })

  wireUpKey({
    key: two,
    left: one,
    right: three,
    down: five
  })

  wireUpKey({
    key: three,
    left: two,
    down: six
  })

  wireUpKey({
    key: four,
    up: one,
    right: five,
    down: seven
  })

  wireUpKey({
    key: five,
    up: two,
    left: four,
    right: six,
    down: eight
  })

  wireUpKey({
    key: six,
    up: three,
    left: five,
    down: nine
  })

  wireUpKey({
    key: seven,
    up: four,
    right: eight
  })

  wireUpKey({
    key: eight,
    up: five,
    left: seven,
    right: nine
  })

  wireUpKey({
    key: nine,
    up: six,
    left: eight
  })

  return {
    keys: [one, two, three, four, five, six, seven, eight, nine],
    current: five
  }
}

function createKeysForPartB() {
  var one = { position: 1 }
  var two = { position: 2 }
  var three = { position: 3 }
  var four = { position: 4 }
  var five = { position: 5 }
  var six = { position: 6 }
  var seven = { position: 7 }
  var eight = { position: 8 }
  var nine = { position: 9 }
  var a = { position: "A" }
  var b = { position: "B" }
  var c = { position: "C" }
  var d = { position: "D" }

  wireUpKey({
    key: one,
    down: three
  })

  wireUpKey({
    key: two,
    down: six,
    right: three
  })

  wireUpKey({
    key: three,
    up: one,
    left: two,
    right: four,
    down: seven
  })

  wireUpKey({
    key: four,
    left: three,
    down: eight
  })

  wireUpKey({
    key: five,
    right: six
  })

  wireUpKey({
    key: six,
    up: two,
    left: five,
    right: seven,
    down: a
  })

  wireUpKey({
    key: seven,
    up: three,
    left: six, 
    right: eight,
    down: b
  })

  wireUpKey({
    key: eight,
    up: four,
    left: seven,
    right: nine,
    down: c
  })

  wireUpKey({
    key: nine,
    left: eight
  })

  wireUpKey({
    key: a,
    up: six,
    right: b
  })

  wireUpKey({
    key: b,
    up: seven,
    left: a,
    right: c,
    down: d
  })

  wireUpKey({
    key: c,
    up: eight,
    left: b
  })

  wireUpKey({
    key: d,
    up: b
  })

  return {
    keys: [one, two, three, four, five, six, seven, eight, nine, a, b, c, d],
    current: five
  }
}

function parseInput(input) {
  if (!input) {
    return []
  }

  var lines = input.split("\n")
  return _(lines)
    .map(line => {
      var chars = line.trim().toUpperCase()
      if (!chars.match(/[UDLR]/)) {
        throw `Error: illegal input for line '${line}'. Only legal input is UDLR.`
      }
      return chars
    })
    .filter(line => line && line.length > 0)
    .value()
}

function solve(commands, keys) {
  var currentKey = keys.current
  var positions = _(commands).map(command => {
    _(command).each(movement => {
      if (movement === constants.up) {
        currentKey = currentKey.moveUp()
      } else if (movement === constants.down) {
        currentKey = currentKey.moveDown()
      } else if (movement === constants.left) {
        currentKey = currentKey.moveLeft()
      } else if (movement === constants.right) {
        currentKey = currentKey.moveRight()
      } else {
        throw `Can't determine which way we are moving: expect UDLR, got '${movement}'. Full line: '${commands}'`
      }
    })

    return currentKey.position
  })
  .value()

  return positions
}

function solvePartA(commands) {
  var keys = createKeysForPartA()
  return solve(commands, keys)
}

function solvePartB(commands) {
  var keys = createKeysForPartB()
  return solve(commands, keys)
}

exports.constants = constants
exports.createKeysForPartA = createKeysForPartA
exports.createKeysForPartB = createKeysForPartB
exports.parseInput = parseInput
exports.solvePartA = solvePartA
exports.solvePartB = solvePartB