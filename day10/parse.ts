import Global = require("./global")

function parseReceiveEvent(line: string): Global.BotReceivesChip {
  const matches = /^value (\d+) goes to bot (\d+)$/.exec(line)
  return new Global.BotReceivesChip(Number(matches[1]), Number(matches[2]))
}

function parseGiveEvent(line: string): Global.BotGivesChips {
  const matches = /^bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)$/.exec(line)
  const lowDestination = matches[2] === "bot" ? Global.DestinationType.Bot : Global.DestinationType.Bin
  const highDestination = matches[4] === "bot" ? Global.DestinationType.Bot : Global.DestinationType.Bin

  const givenFromBotId = Number(matches[1])
  const lowGivenTo = {
    id: Number(matches[3]),
    destinationType: lowDestination
  }
  const highGivenTo = {
      id: Number(matches[5]),
      destinationType: highDestination
  }

  return new Global.BotGivesChips(givenFromBotId, lowGivenTo, highGivenTo)
}

function parse(text: string): Array<Global.BotReceivesChip|Global.BotGivesChips> {
  const lines = text
    .split("\n")
    .map(x => x.trim())
    .filter(x => x !== "")

  const receiveEvents = lines.filter(x => x[0] === "v") // value 5 goes to bot 189
    .map(x => parseReceiveEvent(x))

  const giveEvents = lines.filter(x => x[0] === "b") // bot 138 gives low to bot 9 and high to bot 47
    .map(x => parseGiveEvent(x))

  let typeSafeArray: Array<Global.BotReceivesChip|Global.BotGivesChips> = []
  typeSafeArray = typeSafeArray
    .concat(receiveEvents)
    .concat(giveEvents)
  return typeSafeArray
}

export = parse
