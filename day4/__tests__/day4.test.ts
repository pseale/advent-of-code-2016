import parser = require("../parser")
import roomDupe = require("../room-dupe")

describe("Acceptance tests", () => {
  test("aaaaa-bbb-z-y-x-123[abxyz] is a real room", () => {
    var rooms = parser.parse("aaaaa-bbb-z-y-x-123[abxyz]")
    var room = rooms[0]

    var result = roomDupe.isLegalRoom(room)
    expect(result).toBe(true)
  })

  test("totally-real-room-200[decoy] is not a real room", () => {
    var rooms = parser.parse("totally-real-room-200[decoy]")
    var room = rooms[0]

    var result = roomDupe.isLegalRoom(room)
    expect(result).toBe(false)
  })
})

describe("parsing", () => {
  test("aaaaa-bbb-z-y-x-123[abxyz]", () => {
    var result = parser.parse("aaaaa-bbb-z-y-x-123[abxyz]")

    expect(result.length).toBe(1)
    
    var room = result[0]
    expect(room.encryptedName).toBe("aaaaa-bbb-z-y-x")
    expect(room.sectorId).toBe(123)
    expect(room.checksum).toBe("abxyz")
  })
})

describe("generating a checksum", () => {
  test("aaaaa-bbb-z-y-x-123[abxyz]", () => {
    var result = roomDupe.generateChecksum("aaaaa-bbb-z-y-x")

    expect(result).toBe("abxyz")
  })
})