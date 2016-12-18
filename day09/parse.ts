import _ = require("lodash")

interface ParseCompressionMarkerResult {
  output: string[],
  tokens: string[]
}

function parseCompressionMarker(tokens: string[]): ParseCompressionMarkerResult {
  let tokenString = tokens.join("")
  const match = /^\((\d+)x(\d+)\)/.exec(tokenString)
  const characters = Number(match[1])
  const repeat = Number(match[2])
  const dataSectionPlusRemainingLine = tokenString.substr(match[0].length)
  const dataSection = dataSectionPlusRemainingLine.substr(0, characters)
  const remainingLine = dataSectionPlusRemainingLine.substr(characters)
  return {
    output: Array(repeat + 1).join(dataSection).split(""),
    tokens: remainingLine.split("")
  }
}

function parse(line: string): string {
  let output = []
  let tokens = line.split("")
  let numTokens = []
  let subsequentCharacters = 0

  while (_(tokens).some()) {

    if (tokens[0] === "(") {
      const result = parseCompressionMarker(tokens)
      output = output.concat(result.output)
      tokens = result.tokens
    } else {
      output.push(tokens.shift())
    }
  }

  return output.join("")
}

export = parse
