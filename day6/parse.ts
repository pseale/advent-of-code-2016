"use strict"

import _ = require("lodash")

interface Input {
  columns: string[][]
}

function getColumn(lines: string[], column: number): string[] {
  return _(lines)
    .map(x => x.charAt(column))
    .value()
}

function parse(input: string): Input {
  const numberOfColumns = 8
  const lines = _(input.split("\n"))
    .map(x => x.trim())
    .filter(x => x !== "")
    .value()

  const columns = _(_.range(0, numberOfColumns))
    .map(x => getColumn(lines, x))
    .value()
  return { columns }
}

export = parse
