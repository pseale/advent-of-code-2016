import Global = require("./global")

function parseCpy(tokens: string[]): Global.CpyRegister|Global.CpyValue {
  const destination = Global.Register[tokens[2]]
  const value = Number(tokens[1])
  if (!isNaN(value)) {
    return new Global.CpyValue(value, destination)
  } else {
    return new Global.CpyRegister(Global.Register[tokens[1]], destination)
  }
}

function parseInc(tokens: string[]): Global.Inc {
  return new Global.Inc(Global.Register[tokens[1]])
}

function parseDec(tokens: string[]): Global.Dec {
  return new Global.Dec(Global.Register[tokens[1]])
}

function parseJnz(tokens: string[]): Global.JnzRegister|Global.JnzValue {
  const jump = Number(tokens[2])
  const value = Number(tokens[1])
  if (!isNaN(value)) {
    return new Global.JnzValue(Number(tokens[1]), jump)
  } else {
    return new Global.JnzRegister(Global.Register[tokens[1]], jump)
  }
}

function parseLine(line: string): Global.Instruction {
  const tokens = line.split(" ")
  if (tokens[0] === "cpy") {
    return parseCpy(tokens)
  } else if (tokens[0] === "inc") {
    return parseInc(tokens)
  } else if (tokens[0] === "dec") {
    return parseDec(tokens)
  } else if (tokens[0] === "jnz") {
    return parseJnz(tokens)
  } else {
    throw `Error: couldn't parse line as its first token is unrecognized. Line: '${line}'`
  }
}

function parse(text: string): Global.Instruction[] {
  const lines = text.split("\n")
    .map(x => x.trim())
    .filter(x => x !== "")

  return lines.map(x => parseLine(x))
}

export = parse
