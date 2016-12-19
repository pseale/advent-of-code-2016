import _ = require("lodash")

interface StandardToken {
  length: number,
  text: string
}

interface CompressionMarkerToken {
  length: number,
  dataSection: Array<StandardToken|CompressionMarkerToken>
}

interface ParseCompressionMarkerResult {
  remaining: string,
  token: CompressionMarkerToken
}

function count(tokens: Array<StandardToken|CompressionMarkerToken>): number {
  if (tokens.length === 0) {
    return 0
  }

  return tokens
    .map(token => token.length)
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
}

function parseCompressionMarker(text: string): ParseCompressionMarkerResult {
  const match = /^\((\d+)x(\d+)\)/.exec(text)
  const characters = Number(match[1])
  const repeat = Number(match[2])
  const dataSectionPlusRemainingLine = text.substr(match[0].length)
  const dataSection = dataSectionPlusRemainingLine.substr(0, characters)
  const dataSectionTokens = parse(dataSection)

  const remaining = dataSectionPlusRemainingLine.substr(characters)
  const token = {
    length: repeat * count(dataSectionTokens),
    dataSection: dataSectionTokens
  }

  return {
    remaining,
    token
  }
}

function parse(text: string): Array<StandardToken|CompressionMarkerToken> {
  if (!text || text.length === 0) {
    return []
  }
  const tokens = []
  let remaining = text
  while (remaining.length > 0) {
    if (remaining[0] !== "(") {
      const matches = /^(.*?)(\(|$)/.exec(remaining)
      const token = matches[1]
      remaining = remaining.substr(token.length)
      tokens.push({
        length: token.length,
        text: token
      })
    } else {
      const result = parseCompressionMarker(remaining)
      remaining = result.remaining
      tokens.push(result.token)
    }
  }

  return tokens
}

function parseAndCount(text: string): number {
  const tokens = parse(text)
  return count(tokens)
}

export = parseAndCount
