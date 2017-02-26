import _ = require("lodash")

let input = `Disc #1 has 13 positions; at time=0, it is at position 11.
Disc #2 has 5 positions; at time=0, it is at position 0.
Disc #3 has 17 positions; at time=0, it is at position 11.
Disc #4 has 3 positions; at time=0, it is at position 0.
Disc #5 has 7 positions; at time=0, it is at position 2.
Disc #6 has 19 positions; at time=0, it is at position 17.`

interface Disc {
    positions: number,
    startingPosition: number,
    timeOffset: number
}

function parse(line: string, timeOffset: number): Disc {
  const matches = /has (\d+) positions; at time=0, it is at position (\d+)\.$/.exec(line)
  return {
    positions: Number(matches[1]),
    startingPosition: Number(matches[2]),
    timeOffset: timeOffset
  }
}

function wouldSlipThrough(disc: Disc, time: number): boolean {
  const position = disc.startingPosition + time + disc.timeOffset
  return (position % disc.positions) === 0
}

let discsHaveBeenRearranged = true // Part A / Part B differentiator

function run(): void {
  const lines = input.split("\n")
  let discs = _.range(0, lines.length).map(i => parse(lines[i], i))

  if (discsHaveBeenRearranged) {
    discs = discs.concat({positions: 11, startingPosition: 0, timeOffset: discs.length })
  }

  let time = 0
  while (true) {
    if (_.range(0, discs.length).every(i => wouldSlipThrough(discs[i], time + 1))) {
      console.log(`Everything lines up at time=${time}`)
      break
    }
    time++
  }
}