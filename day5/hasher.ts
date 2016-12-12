"use strict"

import * as _ from "lodash"
var md5 = require("md5")

function solvePartA() {
  let i = 1
  let password = ""
  while (password.length < 8) {
    var result = md5(`ugkcyxxp${i}`)
    var md5Hash = String(result)
    if (md5Hash.substr(0, 5) === "00000") {
      password += md5Hash.substr(5, 1)
    }

    i++
    if (i % 100000 === 0) {
      console.log(`Hashed ${i} hashes...`)
    }
  }
}

var partAPassword = solvePartA()
console.log(`Part A: Final password is: ${partAPassword}`)