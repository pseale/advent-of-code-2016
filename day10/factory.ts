import _ = require("lodash")
import Global = require("./global")

interface Chips {
  low: number,
  high: number
}

class Instructions {
  public giveLowTo: Global.Destination
  public giveHighTo: Global.Destination

  constructor(giveLowTo: Global.Destination, giveHighTo: Global.Destination) {
    this.giveLowTo = giveLowTo
    this.giveHighTo = giveHighTo
  }
}

class Bot {
  public id: number
  private chips: number[]
  private instructions: Instructions

  constructor(id: number) {
    this.id = id
    this.chips = []
  }

  public recordInstructions(giveLowTo: Global.Destination, giveHighTo: Global.Destination) {
    this.instructions = new Instructions(giveLowTo, giveHighTo)
  }

  public canDistributeChips(): boolean {
    return this.chips.length === 2
  }

  public receive(chip: number): Instructions {
    if (this.chips.length >= 2) {
      throw `Error: bots can't hold more than 2 chips. Bot ${this.id} `
            + `with chips ${this.chips.join(",")} attempting to receive chip ${chip}`
    }
    this.chips.push(chip)

    const chips = _(this.chips).sortBy(x => x).value()
    if (chips.length === 2 && chips[0] === 17 && chips[1] === 61) {
      console.log("========================================================")
      console.log(`Part A solution: bot ${this.id} dealt chips 17 and 61.`)
      console.log("========================================================")
    }

    return this.instructions
  }

  public takeChips(): Chips {
    const sortedChips = _(this.chips).sortBy(x => x).value()

    this.chips = []

    return {
      low: sortedChips[0],
      high: sortedChips[1]
    }
  }
}

class Bin {
  public id: number
  public chips: number[]

  constructor(id: number) {
    this.id = id
    this.chips = []
  }

  public receive(chip: number): void {
    this.chips.push(chip)
  }

  public toString(): string {
    return `Bin[${this.id}]: ${this.chips.join(",")}`
  }
}

class Factory {
  private bots: Bot[]
  private bins: Bin[]

  constructor() {
    this.bots = []
    this.bins = []
  }

  public process(event: Global.BotReceivesChip|Global.BotInstructionsCreated): void {
    if (event instanceof Global.BotReceivesChip) {
      this.processReceiveEvent(event)
    } else if (event instanceof Global.BotInstructionsCreated) {
      this.processBotInstructionsCreatedEvent(event)
    } else {
      throw `Error: expected event ${event} to be a legal event, but it reached this impossible place in the code.`
    }
  }

  // this method makes no sense, but alas, ADVENT OF CODE DEMANDS IT
  public solvePartB() {
    const bin0 = this.getBin(0)
    const bin1 = this.getBin(1)
    const bin2 = this.getBin(2)

    console.log("========================================================")
    console.log(`Part B solution: ${bin0.chips[0] * bin1.chips[0] * bin2.chips[0]} `
                + `| bins: ${bin0.toString()} ${bin1.toString()} ${bin2.toString()}`)
    console.log("========================================================")
  }

  private getBot(id: number): Bot {
    const matches = this.bots.filter(x => x.id === id)
    if (matches.length > 0) {
      return matches[0]
    }

    const bot = new Bot(id)
    this.bots.push(bot)
    return bot
  }

  private getBin(id: number): Bin {
    const matches = this.bins.filter(x => x.id === id)
    if (matches.length > 0) {
      return matches[0]
    }

    const bin = new Bin(id)
    this.bins.push(bin)
    return bin
  }

  private processReceiveEvent(event: Global.BotReceivesChip): void {
    const bot = this.getBot(event.botId)
    bot.receive(event.chipId)
    return
  }

  private getDestination(destination: Global.Destination): Bot|Bin {
    if (destination.destinationType === Global.DestinationType.Bot) {
      return this.getBot(destination.id)
    } else if (destination.destinationType === Global.DestinationType.Bin) {
      return this.getBin(destination.id)
    }
  }

  private processBotInstructionsCreatedEvent(event: Global.BotInstructionsCreated): void {
    const from = this.getBot(event.givenFromBotId)
    from.recordInstructions(event.giveLowTo, event.giveHighTo)
    this.processInstructions(from, {giveLowTo: event.giveLowTo, giveHighTo: event.giveHighTo})
  }

  private processInstructions(from: Bot, instructions: Instructions) {
    if (!from.canDistributeChips()) {
      return
    }
    const lowGivenTo = this.getDestination(instructions.giveLowTo)
    const highGivenTo = this.getDestination(instructions.giveHighTo)

    const chips = from.takeChips()

    console.log(`Bot ${from.id} giving low:`
                + `[chip:${chips.low} to `
                + `${Global.DestinationType[instructions.giveLowTo.destinationType]}|${instructions.giveLowTo.id}] `
                + `high:[chip:${chips.high} to `
                + `${Global.DestinationType[instructions.giveHighTo.destinationType]}|${instructions.giveHighTo.id}]`)
    const instructions1 = lowGivenTo.receive(chips.low)
    const instructions2 = highGivenTo.receive(chips.high)

    if (instructions1 instanceof Instructions && lowGivenTo instanceof Bot) {
      this.processInstructions(lowGivenTo, instructions1)
    }
    if (instructions2 instanceof Instructions && highGivenTo instanceof Bot) {
      this.processInstructions(highGivenTo, instructions2)
    }
  }
}

export = Factory
