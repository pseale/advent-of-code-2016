import fs = require("fs")
import color = require("cli-color")

enum IPNumberType {
  Regular,
  Hypernet
}

interface IPNumber {
  type: IPNumberType,
  number: string
}

function parse(line: string): IPNumber[] {
  let mode = IPNumberType.Regular
  let numbers = []
  let r = /(.+?)([\[\]]|$)/g
  let match = r.exec(line)
  while (match !== null) {
    numbers.push({
      type: mode,
      number: match[1]
    })

    mode = mode === IPNumberType.Regular ? IPNumberType.Hypernet : IPNumberType.Regular
    match = r.exec(line)
  }

  return numbers
}

interface ValidationResult {
  number: IPNumber[]
  valid: boolean
}

function valid(ip: IPNumber[]): ValidationResult {
    return {
      number: ip,
      valid: true
    }
}

function invalid(ip: IPNumber[]): ValidationResult {
    return {
      number: ip,
      valid: false
    }
}

function isAbba(candidate: string): boolean {
  if (!candidate || candidate.length !== 4) {
    throw `Cannot determine if '${candidate}' is an ABBA - illegal input.`
  }

  return candidate[0] === candidate[3]
    && candidate[1] === candidate[2]
    && candidate[0] !== candidate[1]
}

function hasAbba(numberString: string): boolean {
  const abbaLength = 4
  const lastPossibleAbbaStartingPosition = numberString.length - abbaLength

  let i = 0
  for (i = 0; i <= lastPossibleAbbaStartingPosition; i++) {
    if (isAbba(numberString.substr(i, abbaLength))) {
      return true
    }
  }
  return false
}

function validate(ip: IPNumber[]): ValidationResult {
  const invalidHypernetNumbers = ip
    .filter(x => x.type === IPNumberType.Hypernet
                 && hasAbba(x.number))

  if (invalidHypernetNumbers.length > 0) {
    return invalid(ip)
  }

  const hasRegularAbbas = ip
    .filter(x => x.type === IPNumberType.Regular
                 && hasAbba(x.number))

  if (hasRegularAbbas.length > 0) {
    return valid(ip)
  }

  return invalid(ip)
}

function isAbaOrBab(candidate: string): boolean {
  if (!candidate || candidate.length !== 3) {
    throw `Cannot determine if '${candidate}' is an ABA or a BAB - illegal input.`
  }

  return candidate[0] === candidate[2]
         && candidate[0] !== candidate[1]
}

function getABAsOrBABsForSingleNumber(numberString: string): string[] {
  const abaLength = 3
  const lastPossibleAbaStartingPosition = numberString.length - abaLength

  let i = 0
  const abasOrBabs: string[] = []
  for (i = 0; i <= lastPossibleAbaStartingPosition; i++) {
    let candidate = numberString.substr(i, abaLength)
    if (isAbaOrBab(candidate)) {
      abasOrBabs.push(candidate)
    }
  }

  return abasOrBabs
}

function getABAsOrBABs(ip: IPNumber[], type: IPNumberType): string[] {
  return ip
    .filter(x => x.type === type)
    .map(x => getABAsOrBABsForSingleNumber(x.number))
    .reduce((previousValue, currentValue) => previousValue.concat(currentValue)) // .flatten()
}

function hasCorrespondingABA(possibleBAB: string, ABAs: string[]): boolean {
  const ABA = possibleBAB[1].concat(possibleBAB[0]).concat(possibleBAB[1])

  return ABAs.indexOf(ABA) !== -1
}

function supportsSSL(ip: IPNumber[]): boolean {
  const ABAs = getABAsOrBABs(ip, IPNumberType.Regular)
  const possibleBABs = getABAsOrBABs(ip, IPNumberType.Hypernet)
  // I want lodash's _.intersection().some() here so bad, i can taste it
  const legalBABs = possibleBABs.filter(possibleBAB => hasCorrespondingABA(possibleBAB, ABAs))
  return legalBABs.length > 0
}

function runPartA(input: string, showDetailedResults?: boolean) {
  const ipAddresses = input.split("\n")
    .filter(x => x !== "")
    .map(line => line.trim())
    .map(line => parse(line))

  const partA = ipAddresses
    .map(ip => validate(ip))
  const validIPs = partA.filter(x => x.valid === true)

  if (showDetailedResults) {
    partA.forEach(ip => {
      const formattedNumbers = ip.number.map(x => x.type === IPNumberType.Hypernet ? `[${x.number}]` : x.number)
      const text = `${formattedNumbers.join("")} - ${ip.valid}`
      if (ip.valid === true) {
        console.log(color.green(text))
      } else {
        console.log(color.red(text))
      }
    })
  }

  console.log(`Part A: ${validIPs.length} valid IPs (of ${ipAddresses.length})`)
}

function runPartB(input: string) {
  const ipAddresses = input.split("\n")
    .filter(x => x !== "")
    .map(line => line.trim())
    .map(line => parse(line))

  const ipsThatSupportSSL = ipAddresses
    .filter(x => supportsSSL(x))

  console.log(`Part B: ${ipsThatSupportSSL.length} valid IPs (of ${ipAddresses.length})`)
}

const input = fs.readFileSync("./input.txt", "utf8")

const partAExamples = `abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn`

runPartA(partAExamples, true)
runPartA(input)

const partBExamples = `aba[bab]xyz
xyx[xyx]xyx
aaa[kek]eke
zazbz[bzb]cdb`

runPartB(partBExamples)
runPartB(input)
