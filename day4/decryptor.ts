import _ = require("lodash")
import duper = require("./room-dupe")

interface Room {
  sectorId : number,
  name : string
}

function decryptLetter(letter: string, rotate : number) : string {
  var charCodeForA = "a".charCodeAt(0)
  var offset = letter.charCodeAt(0) - charCodeForA
  var newCharCode = ((offset + rotate) % 26) + charCodeForA
  return String.fromCharCode(newCharCode)
}

export function decrypt(room : duper.Room) : Room {
  var name = _(room.encryptedName.split(""))
    .map(x => {
      if (x === "-") {
        return " "
      }

      return decryptLetter(x, room.sectorId)
    })
    .value()
    .join("")

  return {
    sectorId: room.sectorId,
    name: name
  }
}