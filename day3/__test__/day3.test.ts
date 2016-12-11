import triangulator = require("../triangulator")
import input = require("../input")

describe("Acceptance tests", () => {
  test("5 10 25", () => {
    var result = triangulator.isTriangle(5, 10, 25)

    expect(result.isLegalTriangle).toBe(false)
  })

  test("5 10 25, but not in any order of size", () => {
    var result = triangulator.isTriangle(10, 25, 5)

    expect(result.isLegalTriangle).toBe(false)
  })
  
  test("valid triangle 5 5 5", () => {
    var result = triangulator.isTriangle(5, 5, 5)

    expect(result.side1).toBe(5)
    expect(result.side2).toBe(5)
    expect(result.side3).toBe(5)
    expect(result.isLegalTriangle).toBe(true)
  })
})

describe("Vertical parsing", () => {
  test("Input with wrong number of rows will throw an error", () => {
    var lines = `1 2 3
1 2 3
1 2 3
1 2 3`
    
    expect(() => input.parseInputForPartB(lines)).toThrow()
  })

  test("Vertical triangles are parsed in groups of 3", () => {
    var lines = `3 4 5
6 7 8
9 10 11`

    var result = input.parseInputForPartB(lines)
    expect(result.length).toBe(3)

    var triangle1 = result[0]
    expect(triangle1.side1).toBe(3)
    expect(triangle1.side2).toBe(6)
    expect(triangle1.side3).toBe(9)

    var triangle2 = result[1]
    expect(triangle2.side1).toBe(4)
    expect(triangle2.side2).toBe(7)
    expect(triangle2.side3).toBe(10)
    
    var triangle3 = result[2]
    expect(triangle3.side1).toBe(5)
    expect(triangle3.side2).toBe(8)
    expect(triangle3.side3).toBe(11)
  })
})