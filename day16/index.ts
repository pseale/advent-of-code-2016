import _ = require("lodash")
let partAInput = "01110110101001000"

function flipItAndReverseIt(input: string): string {
  return input.concat("0").concat((_.reverse(input.split(""))).map(x => x === "1" ? "0" : "1").join(""))
}

function fillDisk(input: string, size: number): string {
  let data = input
  while (data.length < size) {
    data = flipItAndReverseIt(data)
  }

  return data.substr(0, size)
}

function generateChecksum(input: string): string {
  let checksum = input
  while (true) {
    checksum = _.range(0, Math.floor(checksum.length / 2)).map(i => checksum[i*2] === checksum[i*2 + 1] ? "1" : "0").join("")
    if (checksum.length % 2 !== 0) {
      return checksum
    }
  }
}

console.log(`Part A: ${generateChecksum(fillDisk(partAInput, 272))}`)
console.log(`Part B: ${generateChecksum(fillDisk(partAInput, 35651584))}`)
