import _ = require("lodash")
import Global = require("./global")

interface Chips {
  low: number,
  high: number
}

class Bot {
  public id: number
  private chips: number[]

  constructor(id: number) {
    this.id = id
    this.chips = []
  }

  public canDistributeChips(): boolean {
    return this.chips.length === 2
  }

  public receive(chip: number): void {
    if (this.chips.length >= 2) {
      throw `Error: bots can't hold more than 2 chips. Bot ${this.id} `
            + `with chips ${this.chips.join(",")} attempting to receive chip ${chip}`
    }
    this.chips.push(chip)

    const chips = _(this.chips).sortBy(x => x).value()
    if (chips.length === 2 && chips[0] === 17 && chips[1] === 61) {
      console.log(`Part A solution: bot ${this.id} dealt chips 17 and 61.`)
    } else {
      console.log(`bot ${this.id} has chips ${this.chips.join(",")}`)
    }
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
  private chips: number[]

  constructor(id: number) {
    this.id = id
    this.chips = []
  }

  public receive(chip: number): void {
    this.chips.push(chip)
  }
}

class Factory {
  private bots: Bot[]
  private bins: Bin[]

  constructor() {
    this.bots = []
    this.bins = []
  }

  public process(event: Global.BotReceivesChip|Global.BotGivesChips): void {
    if (event instanceof Global.BotReceivesChip) {
      this.processReceiveEvent(event)
    } else if (event instanceof Global.BotGivesChips) {
      this.processGiveEvent(event)
    } else {
      throw `Error: expected event ${event} to be a legal event, but it reached this impossible place in the code.`
    }
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

  private processGiveEvent(event: Global.BotGivesChips): void {
    const givenFromBot = this.getBot(event.givenFromBotId)
    if (!givenFromBot.canDistributeChips()) {
      console.log(`Bot ${givenFromBot.id} can't give its chips because it doesn't have two chips to give.`)
      return
    }
    const lowGivenTo = this.getDestination(event.lowGivenTo)
    const highGivenTo = this.getDestination(event.highGivenTo)

    const chips = givenFromBot.takeChips()

    console.log(`Bot ${givenFromBot.id} giving low:[chip:${chips.low} to ${event.lowGivenTo.destinationType}|${event.lowGivenTo.id}] high:[chip:${chips.high} to ${event.highGivenTo.destinationType}|${event.highGivenTo.id}]`)
    lowGivenTo.receive(chips.low)
    highGivenTo.receive(chips.high)
  }
}

export = Factory
