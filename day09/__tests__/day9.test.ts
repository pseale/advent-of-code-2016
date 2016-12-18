import parse = require("../parse")

describe("Acceptance tests", () => {
  test("Text with no markers should be kept verbatim", () => {
    const result = parse("ADVENT")

    expect(result).toBe("ADVENT")
  })

  test("Text with any markers should repeat the following text", () => {
    const result = parse("A(1x5)BC")

    expect(result).toBe("ABBBBBC")
  })

  test("Text within the data section of a marker is not parsed for markers", () => {
    const result = parse("X(8x2)(3x3)ABCY")

    expect(result).toBe("X(3x3)ABC(3x3)ABCY")
  })
})
