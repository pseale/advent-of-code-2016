import _ = require("lodash")
import combinations = require("./combinations")

interface FloorInput {
  name: string,
  generators: string[],
  microchips: string[]
}

interface Floor {
  offset: number,
  name: string,
  components: Component[]
}

interface Move {
  destinationFloor: number,
  components: Component[]
}

interface Solution {
  moves: Move[]
}

interface StartingState {
  startingFloor: number,
  collectorFloor: number,
  floors: Floor[],
  moves: Move[]
}

interface State {
  currentFloor: number,
  floors: Floor[],
  moves: Move[]
}

export function load(input: FloorInput[]): StartingState {
  const floors = _.range(0, input.length).map(i => {
    const floor = input[i]
    const generators = floor.generators.map(x => {
      return {
        type: ComponentType.Generator,
        element: x
      }
    })

    const microchips = floor.microchips.map(x => {
      return {
        type: ComponentType.Microchip,
        element: x
      }
    })

    return {
      offset: i,
      name: floor.name,
      components: generators.concat(microchips)
    }
  })

  return {
    startingFloor: 0,
    collectorFloor: input.length,
    floors,
    moves: []
  }
}

enum ComponentType {
  Generator,
  Microchip
}

interface Component {
  type: ComponentType,
  element: string
}

function getState(state: State, move: Move): State {
  const startFloor = state.floors[state.currentFloor]
  const destinationFloor = state.floors[move.destinationFloor]

  const newStartFloor = {
    offset: startFloor.offset,
    name: startFloor.name,
    components: _(startFloor.components).difference(move.components).value()
  }

  const newDestinationFloor = {
    offset: destinationFloor.offset,
    name: destinationFloor.name,
    components: destinationFloor.components.concat(move.components)
  }

  const otherFloors = state.floors.filter(x => x.name !== startFloor.name && x.name !== destinationFloor.name)
  const newFloors = _(otherFloors.concat([newStartFloor, newDestinationFloor]))
    .sortBy(x => x.offset)
    .value()

  return {
    currentFloor: move.destinationFloor,
    moves: state.moves.concat(move),
    floors: newFloors
  }
}

function isASolution(state: State, collectorFloor: number): boolean {
  if (state.currentFloor !== collectorFloor) {
    return false
  }

  const allOtherFloors = state.floors.filter(x => x.name !== state.floors[collectorFloor].name)
  const anyOtherFloorHasAComponent = _(allOtherFloors)
    .filter(x => x.components.length !== 0)
    .some()

  if (anyOtherFloorHasAComponent) {
    return false
  }

  return true
}

function getMovesTo(state: State, destinationFloor: number): Move[] {
  const floor = state.floors[state.currentFloor]
  const allCombinations = combinations(floor.components, 2).concat(combinations(floor.components, 1))

  return allCombinations.map(components => {
    return {
      destinationFloor,
      components
    }
  })
}

function wouldBurnMicrochips(components: Component[]): boolean {
  const groups = _(components).groupBy(x => x.element).value()

  const unpairedComponents = components.filter(x => groups[x.element].length === 1)

  const unpairedMicrochipsExist = _(unpairedComponents)
    .filter(x => x.type === ComponentType.Microchip)
    .some()

  const unpairedGeneratorsExist = _(unpairedComponents)
    .filter(x => x.type === ComponentType.Generator)
    .some()

  if (unpairedMicrochipsExist && unpairedGeneratorsExist) {
    return true
  }

  return false
}

function isFloorOk(floor: Floor): boolean {
  return !wouldBurnMicrochips(floor.components)
}

function IsOk(state: State): boolean {
  const anyFloorsNotOk = _(state.floors)
    .filter(x => !isFloorOk(x))
    .some()

  const lastMove = state.moves[state.moves.length-1]
  if (anyFloorsNotOk) {
    return false
  }

  const moveInElevatorNotOk = wouldBurnMicrochips(lastMove.components)
  if (moveInElevatorNotOk) {
    return false
  }

  return true
}

function getUsefulMoves(state: State): State[] {
  let moves = []

  if (state.currentFloor < state.floors.length - 1) {
    moves = moves.concat(getMovesTo(state, state.currentFloor + 1))
  }

  if (state.currentFloor > 0) {
    moves = moves.concat(getMovesTo(state, state.currentFloor - 1))
  }

  // TODO: remove duplicates/infinite loops
  return moves
    .map(move => getState(state, move))
    .filter(x => IsOk(x))
}

export function solve(startingState: StartingState): Solution {
  let q = [{
      currentFloor: startingState.startingFloor,
      moves: [],
      floors: startingState.floors
    }]

  while (true) {
    const state = q.shift()

    const newStates = getUsefulMoves(state)
    const solutions = newStates.filter(newState => isASolution(newState, startingState.collectorFloor))
    if (solutions.length > 0) {
      return { moves: state.moves.concat([solutions[0]]) }
    }

    q = q.concat(newStates)
  }
}