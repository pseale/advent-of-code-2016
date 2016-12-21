// Part A or Part B
export enum InitType {
  a,
  b
}


export enum Register {
  a,
  b,
  c,
  d
}

export class CpyRegister {
  private _source: Register
  private _destination: Register

  get source(): Register { return this._source }
  get destination(): Register { return this._destination }

  public constructor(source: Register, destination: Register) {
    this._source = source
    this._destination = destination
  }
}

export class CpyValue {
  private _value: number
  private _destination: Register

  get value(): number { return this._value }
  get destination(): Register { return this._destination }

  public constructor(value: number, destination: Register) {
    this._value = value
    this._destination = destination
  }
}

export class Inc {
  private _register: Register

  get register(): Register { return this._register }

  public constructor(register: Register) {
    this._register = register
  }
}

export class Dec {
  private _register: Register

  get register(): Register { return this._register }

  public constructor(register: Register) {
    this._register = register
  }
}

export class JnzValue {
  private _value: number
  private _jump: number

  get value(): Register { return this._value }
  get jump(): Register { return this._jump }

  public constructor(value: number, jump: number) {
    this._value = value
    this._jump = jump
  }
}

export class JnzRegister {
  private _register: Register
  private _jump: number

  get register(): Register { return this._register }
  get jump(): Register { return this._jump }

  public constructor(register: Register, jump: number) {
    this._register = register
    this._jump = jump
  }
}

export type Instruction = CpyRegister|CpyValue|Inc|Dec|JnzRegister|JnzValue

export interface RegisterState {
  register: Register,
  value: number
}
