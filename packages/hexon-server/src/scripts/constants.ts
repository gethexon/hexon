import fs from "fs"
import path from "path"
import { readJsonFile } from "./utils"

export const logo: string = (() => {
  try {
    fs.readFileSync(path.resolve(__dirname, "../assets/logo.art"), "utf-8")
  } catch (err) {
    console.error(err)
    return "Hexon"
  }
})()

export const version: string = readJsonFile("./package.json").version
