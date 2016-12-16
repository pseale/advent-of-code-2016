import _ = require("lodash")

interface RoomInput {
  encryptedName : string,
  sectorId : number,
  checksum : string
}

interface Room {
  sectorId : number,
  encryptedName : string,
  legal : boolean
}

export function generateChecksum(encryptedName : string) : string {
  var roomNameWithoutDashes = encryptedName.replace(/-/g, "")
  var lodashGroups = _(roomNameWithoutDashes)
    .groupBy(x => x)
    .value()
  
  var letters = []
  _.forOwn(lodashGroups, (value, key) => {
    letters.push({
      letter: key,
      occurrencesSortableAscending: -value.length //for convenience sorting by both fields in ascending order, change it so that the letter with the most "occurrences" sorts as first in ascending order. To do so, negate the occurrences.
    })
  })

  var expectedChecksumArray = _(_.sortBy(letters, ["occurrencesSortableAscending", "letter"]))
    .map(x => x.letter)
    .take(5)
    .value()
  
  var expectedChecksum = expectedChecksumArray.join("")

  return expectedChecksum
}

export function check(room : RoomInput) : Room {
  var legal = room.checksum ===  generateChecksum(room.encryptedName)
  return {
    sectorId: room.sectorId,
    encryptedName: room.encryptedName,
    legal: legal
  }
}