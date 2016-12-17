"use strict"

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

function drawGrid(steps, node) {
  let innerHTML = _.range(0, 6).map(row => {
    return _.range(0, 50).map(col => Math.random() > 0.5 ? "&#9608;" : " ").join("")
  }).join("\n")

  node.innerHTML = innerHTML
}

