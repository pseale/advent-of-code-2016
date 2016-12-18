"use strict"

const Rows = 6
const Columns = 50

function drawLog(steps, node) {
  if ((!steps && steps !== 0) || typeof(steps) !== 'number' || steps < 0) {
    throw `Cannot draw the log--expected a valid step #, got '${steps}'`
  }

  if (!node) {
    throw `Cannot draw the log--HTML element representing the log is null.`
  }

  
  let newChildren = _(getInput())
    .take(steps)
    .map(x => {
      let $div = document.createElement("div")
      $div.innerHTML = x.text
      return $div
    })
    .value()

  let lastLogEntry = _(newChildren).last()
  if (lastLogEntry) {
    lastLogEntry.setAttribute("class", "highlighted")
  }

  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }

  newChildren.forEach(x => node.appendChild(x))
}

function applyRect(rows, rect) {
  _.range(0, rect.rows).forEach(row => {
    _.range(0, rect.columns).forEach(col => {
      rows[row][col] = true
    })
  })
}

function applyRotateRow(rows, rotate) {
  const row = rows[rotate.position]
  let overflowRows = _.range(Columns - rotate.rotateBy, Columns).map(col => row[col])
  let shiftedRows = _.range(0, Columns - rotate.rotateBy).map(col => row[col])
  
  rows[rotate.position] = overflowRows.concat(shiftedRows)
}

function applyRotateColumn(rows, rotate) {
  let col = rotate.position
  let overflowColumns = _.range(Rows - rotate.rotateBy, Rows).map(row => rows[row][col])
  let shiftedColumns = _.range(0, Rows - rotate.rotateBy).map(row => rows[row][col])
  
  let newColumns = overflowColumns.concat(shiftedColumns)
  _.range(0, Rows).forEach(row => rows[row][col] = newColumns[row])
}

function applyInput(rows, input) {
  if (input.rect) {
    applyRect(rows, input.rect)
  }

  if (input.rotate) {
    if (input.rotate.rotationType === "row") {
      applyRotateRow(rows, input.rotate)
    } else if (input.rotate.rotationType === "column") {
      applyRotateColumn(rows, input.rotate)
    }
  }
}

function getGrid(inputs) {
  const rows = _.range(0, Rows).map(row => {
    return _.range(0, Columns).map(col => false)
  })

  inputs.forEach(input => applyInput(rows, input))

  return rows
}

function drawGrid(steps, node) {
  const grid = getGrid(_.take(getInput(), steps))
  let innerHTML = _.range(0, 6).map(row => {
    return _.range(0, 50).map(col => grid[row][col] ? "&#9608;" : " ").join("")
  }).join("\n")

  let pixelsChecksum = _(_.range(0, 6).map(row => {
    return _.range(0, 50).map(col => grid[row][col] ? 1 : 0)
  })).flatten().sum()

  innerHTML = innerHTML + `\n\n    (${pixelsChecksum} pixels lit)`
  node.innerHTML = innerHTML
}

