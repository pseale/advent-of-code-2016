import parse = require("../parser")
import checker = require("../checker")
import decrypt = require("../decrypt")

describe("Acceptance tests", () => {
  test("aaaaa-bbb-z-y-x-123[abxyz] is a real room", () => {
    var rooms = parse("aaaaa-bbb-z-y-x-123[abxyz]")
    var room = rooms[0]

    var result = checker.check(room)
    expect(result.sectorId).toBe(123)
    expect(result.encryptedName).toBe("aaaaa-bbb-z-y-x")
    expect(result.legal).toBe(true)
  })

  test("totally-real-room-200[decoy] is not a real room", () => {
    var rooms = parse("totally-real-room-200[decoy]")
    var room = rooms[0]

    var result = checker.check(room)
    expect(result.sectorId).toBe(200)
    expect(result.encryptedName).toBe("totally-real-room")
    expect(result.legal).toBe(false)
  })
})

describe("parsing", () => {
  test("aaaaa-bbb-z-y-x-123[abxyz]", () => {
    var result = parse("aaaaa-bbb-z-y-x-123[abxyz]")

    expect(result.length).toBe(1)
    
    var room = result[0]
    expect(room.encryptedName).toBe("aaaaa-bbb-z-y-x")
    expect(room.sectorId).toBe(123)
    expect(room.checksum).toBe("abxyz")
  })
})

describe("generating a checksum", () => {
  test("aaaaa-bbb-z-y-x-123[abxyz]", () => {
    var result = checker.generateChecksum("aaaaa-bbb-z-y-x")

    expect(result).toBe("abxyz")
  })
})

describe("decrypt", () => {
  test("'qzmt-zixmtkozy-ivhz-343' is 'very encrypted name'", () => {
    var r = {
      encryptedName: "qzmt-zixmtkozy-ivhz",
      sectorId: 343,
      legal: true
    }
    var result = decrypt(r)

    expect(result.sectorId).toBe(343)
    expect(result.name).toBe("very encrypted name")
  })
})