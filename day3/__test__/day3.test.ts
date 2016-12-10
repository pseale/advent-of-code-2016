import triangulator = require("../triangulator")

describe("Acceptance tests", () => {
  test("5 10 25", () => {
    var result = triangulator.isTriangle(5, 10, 25)

    expect(result).toBe(false)
  })

  test("5 10 25, but not in any order of size", () => {
    var result = triangulator.isTriangle(10, 25, 5)

    expect(result).toBe(false)
  })
  
  test("valid triangle 5 5 5", () => {
    var result = triangulator.isTriangle(5, 5, 5)

    expect(result).toBe(true)
  })  
})