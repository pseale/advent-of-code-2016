interface Floor {
  name: string,
  generators: string[],
  microchips: string[]
}

function parse(text: string): Floor[] {
  const lines = text.split("\n")
    .map(x => x.trim())
    .filter(x => x !== "")

  return lines.map(line => {
    const nameMatch = /^The (\w+) floor contains /.exec(line)
    const remaining = line.substr(nameMatch[0].length)

    if (remaining === "nothing relevant.") {
      return {
        name: nameMatch[1],
        generators: [],
        microchips: []
      }
    }

    const name = nameMatch[1]
    const generators = []
    const microchips = []
    const componentRegex = /a (\w+)(-compatible)? (\w+)(,|, and|.$)/g
    let componentMatch = componentRegex.exec(remaining)
    while (componentMatch !== null) {
      if (componentMatch[3] === "generator") {
        generators.push(componentMatch[1])
      } else if (componentMatch[3] === "microchip") {
        microchips.push(componentMatch[1])
      } else {
        throw `Error: could not determine component '${componentMatch[3]} - `
              + `expected 'generator' or 'microchip'. Line: '${line}'`
      }

      componentMatch = componentRegex.exec(remaining)
    }

    return {
      name,
      generators,
      microchips
    }
  })
}

export = parse
