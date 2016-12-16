"use strict"

import * as _ from "lodash"
const md5 = require("md5")

function solvePartA() {
  let i = 1
  let password = ""
  while (password.length < 8) {
    const result = md5(`ugkcyxxp${i}`)
    const md5Hash = String(result)
    if (md5Hash.substr(0, 5) === "00000") {
      password += md5Hash.substr(5, 1)
    }

    i++
    if (i % 100000 === 0) {
      console.log(`Hashed ${i} hashes...`)
    }
  }
}

function fillInPassword(password : string[], position : number, character : string) : void {
  if (password[position] === null) {
    password[position] = character
  }
}

function solvePartB() {
  let i = 1
  let password = [null, null, null, null, null, null, null, null]
  while (password.some(x => x === null)) {
    const result = md5(`ugkcyxxp${i}`)
    const md5Hash = String(result)
    if (md5Hash.substr(0, 5) === "00000") {
      var sixthChar = md5Hash.substr(5, 1)
      var seventhChar = md5Hash.substr(6, 1)
      if (sixthChar >= "0" && sixthChar <= "7") {
        fillInPassword(password, Number(sixthChar), seventhChar)
      }
    }

    i++
    if (i % 100000 === 0) {
      console.log(`[${password.join("")}] Hashed ${i} hashes...`)
    }
  }

  return password.join("")
}

var partAPassword = solvePartA()
console.log(`Part A: Final password is: ${partAPassword}`)

var partBPassword = solvePartB()
console.log(`Part B: Final password is: ${partBPassword}`)
