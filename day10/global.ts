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

export class BotGivesChips {
  public givenFromBotId: number
  public lowGivenTo: Destination
  public highGivenTo: Destination

  constructor(givenFromBotId: number, lowGivenTo: Destination, highGivenTo: Destination) {
    this.givenFromBotId = givenFromBotId
    this.lowGivenTo = lowGivenTo
    this.highGivenTo = highGivenTo
  }
}
