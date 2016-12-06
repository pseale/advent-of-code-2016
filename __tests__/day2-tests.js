var day2 = require("../day2/day2")

describe("day2.parseInput", () => {
  test("parsing an empty line gives no instructions", () => {
    var parsedInput = day2.parseInput(null)

    expect(parsedInput).toEqual([])
  })

  test("parsing a simple command works", () => {
    var parsedInput = day2.parseInput("U")

    expect(parsedInput).toEqual([day2.constants.up])
  })

  test("parsing invalid input throws an error", () => {
    var parsedInput = day2.parseInput("DULLARD")

    expect(parsedInput).toThrow()
  })

  test("parsing a line with leading and trailing whitespace is trimmed", () => {
    var parsedInput = day2.parseInput("\t\t   UDLUD    ")

    expect(parsedInput).toEqual(["UDLUD"])
  })
})

describe("day2.createKeys", () => {
  test("keypad starts at the 5", () => {
    var keys = day2.createKeys()

    expect(keys.current.position).toBe(5)
  })
})

describe("Acceptance tests", () => {
  test("Acceptance: basic sample works", () => {
    var input = `ULL
                 RRDDD
                 LURDL
                 UUUUD`

    var commands = day2.parseInput(input)
    var result = day2.solvePartA(commands)

    expect(result).toEqual([1, 9, 8, 5])
  })
})
