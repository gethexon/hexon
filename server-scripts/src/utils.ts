import fs from "fs"
import chalk from "chalk"
import { version } from "./constants"

function section(title: string) {
  console.log()
  console.log(chalk.blue.bold("⚙ " + title))
  console.log()
}

function log(...args: any[]) {
  console.log(...args)
}
function info(...args: any[]) {
  console.log(chalk.blue(...args))
}

function success(...args: any[]) {
  console.log(chalk.green(...args))
}

function warn(...args: any[]) {
  console.log(chalk.yellow(...args))
}

function error(...args: any[]) {
  console.log(chalk.red(...args))
}

export const printer = {
  section,
  log,
  success,
  info,
  warn,
  error,
}

export function readJsonFile(filename: string) {
  const file = fs.readFileSync(filename, { encoding: "utf-8" })
  return JSON.parse(file)
}

export function printVersion(){
    printer.section("Check version")
    printer.info(`Current Version: ${version}`)
    if (version.indexOf("-") >= 0) {
      printer.warn("This is a preview version!")
    }
}