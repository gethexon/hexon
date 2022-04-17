import fs from "fs"
import path from "path"
import { readJsonFile } from "./utils"

export const logo: string = (() => {
  try {
    return fs.readFileSync(path.resolve(process.cwd(), "./assets/logo.art"), "utf-8")
  } catch (err) {
    console.error(err)
    return "Hexon"
  }
})()

export const version: string = readJsonFile("./package.json").version
