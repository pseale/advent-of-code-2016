import _ = require("lodash")

interface Room {
  encryptedName : string,
  sectorId : number,
  checksum : string
}

function parse(input : string) : Room[] {
  var lines = _(input.split("\n"))
    .map(x => x.trim())
    .filter(x => x !== "")
    .value()

  return _(lines)
    .map(line => {
      var regexGroups = /^(.+)-(\d+)\[(.+)\]$/.exec(line)
      if (!regexGroups || !regexGroups.length || regexGroups.length !== 4) {
        throw `Unable to parse room: ${line}`
      }

      var encryptedName = regexGroups[1]
      var sectorIdString = regexGroups[2]
      var checksum = regexGroups[3]

      if (!encryptedName || !sectorIdString || !checksum) {
        throw `Invalid room - expected values for encrypted name:'${encryptedName}' sector ID:'${sectorIdString}' checksum:'${checksum}' for room ${line}`
      }

      if (encryptedName !== encryptedName.toLowerCase()) {
        throw `Expected room name '${encryptedName}' to be in all lower-case for room ${line}`
      }

      var sectorId = Number(sectorIdString)
      if (isNaN(sectorId)) {
        throw `Invalid sector ID: ${regexGroups[2]} for room ${line}`
      }

      return {
        encryptedName: encryptedName,
        sectorId: sectorId,
        checksum: checksum
      }
    })
    .value()
}

export = parse