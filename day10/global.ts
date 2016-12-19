export class BotReceivesChip {
  public chipId: number
  public botId: number

  constructor(chipId: number, botId: number) {
    this.chipId = chipId
    this.botId = botId
  }
}

export enum DestinationType {
  Bot,
  Bin
}

export interface Destination {
  id: number,
  destinationType: DestinationType
}

export class BotInstructionsCreated {
  public givenFromBotId: number
  public giveLowTo: Destination
  public giveHighTo: Destination

  constructor(givenFromBotId: number, giveLowTo: Destination, giveHighTo: Destination) {
    this.givenFromBotId = givenFromBotId
    this.giveLowTo = giveLowTo
    this.giveHighTo = giveHighTo
  }
}
