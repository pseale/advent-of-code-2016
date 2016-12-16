import _ = require("lodash")
import checker = require("./checker")

interface EncryptedRoom {
  sectorId : number,
  encryptedName : string
}

interface DecryptedRoom {
  sectorId : number,
  name : string
}

function decryptAlphabeticalLetter(letter: string, rotate : number) : string {
  var charCodeForA = "a".charCodeAt(0)
  var offset = letter.charCodeAt(0) - charCodeForA
  var newCharCode = ((offset + rotate) % 26) + charCodeForA
  return String.fromCharCode(newCharCode)
}

function decrypt(encryptedRoom : EncryptedRoom) : DecryptedRoom {
  var name = _(encryptedRoom.encryptedName.split(""))
    .map(x => {
      if (x === "-") {
        return " "
      }

      return decryptAlphabeticalLetter(x, encryptedRoom.sectorId)
    })
    .value()
    .join("")

  return {
    sectorId: encryptedRoom.sectorId,
    name: name
  }
}

export = decrypt