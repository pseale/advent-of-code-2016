import _ = require("lodash")
import Global = require("./global")

type Registers = Global.RegisterState[]

interface State {
  location: number,
  registers: Registers
}


// for the purposes of Advent of Code, we'll assume registers are initialized to 0
// Part B - AHA! I KNEW IT! Can't get fooled twice.
function init(type: Global.InitType): State {
  return {
    location: 0,
    registers: [
      { register: Global.Register.a, value: 0},
      { register: Global.Register.b, value: 0},
      { register: Global.Register.c, value: type === Global.InitType.b ? 1 : 0},
      { register: Global.Register.d, value: 0},
    ]
  }
}

function replace(registers: Registers, registerState: Global.RegisterState): Registers {
  const others = registers.filter(x => x.register !== registerState.register)
  return others.concat(registerState)
}

function processCpyValue(state: State, cpyValue: Global.CpyValue): State {
  const registerNewState = {
    register: cpyValue.destination,
    value: cpyValue.value
  }

  return {
    location: state.location + 1,
    registers: replace(state.registers, registerNewState)
  }
}

function processCpyRegister(state: State, cpyRegister: Global.CpyRegister): State {
  const copyFrom = state.registers.filter(x => x.register === cpyRegister.source)[0]
  const registerNewState = {
    register: cpyRegister.destination,
    value: copyFrom.value
  }

  return {
    location: state.location + 1,
    registers: replace(state.registers, registerNewState)
  }
}

function processIncOrDec(state: State, register: Global.Register, value: number): State {
  const registerCurrentState = state.registers.filter(x => x.register === register)[0]
  const registerNewState = {
    register,
    value: registerCurrentState.value + value
  }

  return {
    location: state.location + 1,
    registers:  replace(state.registers, registerNewState)
  }
}

function processInc(state: State, inc: Global.Inc): State {
  return processIncOrDec(state, inc.register, +1)
}

function processDec(state: State, dec: Global.Dec): State {
  return processIncOrDec(state, dec.register, -1)
}

function jumpIfNotZero(state: State, value: number, jump: number): State {
  if (value !== 0) {
    return {
      location: state.location + jump,
      registers: state.registers
    }
  }

  return {
    location: state.location + 1,
    registers: state.registers
  }
}

function processJnzRegister(state: State, jnz: Global.JnzRegister): State {
  const register = state.registers.filter(x => x.register === jnz.register)[0]

  // Jump if Not Zero (JNZ)
  return jumpIfNotZero(state, register.value, jnz.jump)
}

function processJnzValue(state: State, jnz: Global.JnzValue): State {
  // Jump if Not Zero (JNZ)
  return jumpIfNotZero(state, jnz.value, jnz.jump)
}

function prettyPrint(state: State): void {
  console.log(`Memory location: ${state.location}`)
  _(state.registers)
    .sortBy(x => x.register)
    .each(x => console.log(`Register ${Global.Register[x.register]}: ${x.value}`))
}

function process(state: State, instruction: Global.Instruction): State {
  if (instruction instanceof Global.CpyValue) {
    return processCpyValue(state, instruction)
  } else if (instruction instanceof Global.CpyRegister) {
    return processCpyRegister(state, instruction)
  } else if (instruction instanceof Global.Inc) {
    return processInc(state, instruction)
  } else if (instruction instanceof Global.Dec) {
    return processDec(state, instruction)
  } else if (instruction instanceof Global.JnzRegister) {
    return processJnzRegister(state, instruction)
  } else if (instruction instanceof Global.JnzValue) {
    return processJnzValue(state, instruction)
  } else {
    throw `Error: couldn't process instruction ${instruction} - type '${typeof(instruction)}'`
  }
}

function run(instructions: Global.Instruction[], type: Global.InitType): void {
  let state = init(type)

  let locationIndicatingWeShouldTerminate = instructions.length

  while (state.location < locationIndicatingWeShouldTerminate) {
    state = process(state, instructions[state.location])
  }

  prettyPrint(state)
}

export = run
