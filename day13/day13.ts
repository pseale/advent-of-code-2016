import crypto = require("crypto")
import _ = require("lodash")

let seed = "ahsbgdzn"
let useKeyStretching = true // part A / part B differentiator

let hashes: Object = {}
function getHash(i: number) {
  if (hashes[i] === undefined) {
    if (useKeyStretching) {
      hashes[i] = _.range(0, 2016 + 1).reduce((previousValue, currentValue) => crypto.createHash("md5").update(previousValue).digest("hex"), `${seed}${i}`)
    } else {
      hashes[i] = crypto.createHash("md5").update(`${seed}${i}`).digest("hex")
    }
  }

  return hashes[i]
}

function getThreeInARow(hash: string): string|void {
  const threes = _.range(0, hash.length - 3 + 1)
    .filter(i => hash[i] === hash[i + 1] && hash[i] === hash[i + 2])
  if (threes.length === 0) {
    return null
  }

  return hash[threes[0]]
}

function hasFiveInARow(letter: string, start: number): boolean {
  for (let i = start + 1; i <= start + 1000; i++) {
    const hash = getHash(i)
    if (hash.indexOf(Array(5 + 1).join(letter)) >= 0) {
      return true
    }
  }

  return false
}

function run(target: number): void {
  let i = 0
  let hits = 0
  while (hits < target) {
    const hash = getHash(i)
    const threes = getThreeInARow(hash)
    if (threes && hasFiveInARow(threes, i)) {
      hits++
      console.log(`Hit #${hits} - index ${i}`)
    }
    i++
  }
}