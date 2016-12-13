import _ = require("lodash")

interface Input {
  columns: string[][]
}

interface ColumnResult {
  mostFrequent: string,
  leastFrequent: string
}

interface LetterFrequencies {
  letter: string,
  occurrences: number
}

interface DecodeResult {
  mostFrequent: string,
  leastFrequent: string
}

function getMostAndLeastFrequentLetters(column: string[]): ColumnResult {
  const groups = _(column)
    .groupBy(x => x)
    .value()

  const letters: LetterFrequencies[] = []
  _.forOwn(groups, (value, key) => {
    letters.push({
      letter: key,
      occurrences: value.length
    })
  })

  const mostFrequent = _(letters)
    .sortBy(x => x.occurrences)
    .map(x => x.letter)
    .last()
  const leastFrequent = _(letters)
    .sortBy(x => x.occurrences)
    .map(x => x.letter)
    .first()

  return {
    mostFrequent,
    leastFrequent
  }
}

function decode(input: Input): DecodeResult {
  const lettersArray = _(input.columns)
    .map(column => getMostAndLeastFrequentLetters(column))
    .value()

  const mostFrequent = _(lettersArray)
    .map(x => x.mostFrequent )
    .join("")
  const leastFrequent = _(lettersArray)
    .map(x => x.leastFrequent )
    .join("")

  return {
    mostFrequent,
    leastFrequent
  }
}

export = decode
