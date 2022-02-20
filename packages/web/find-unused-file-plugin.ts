import fs from "fs"
import path from "path"
import { Plugin } from "vite"
import chalk from "chalk"

function list(root: string): string[] {
  if (fs.lstatSync(root).isFile()) {
    return [path.resolve(root)]
  } else {
    return fs
      .readdirSync(root)
      .map((record) => list(path.join(root, record)))
      .reduce((arr, i) => [...arr, ...i], [] as string[])
  }
}

const allFile = new Set<string>()

const current = path.resolve(".")

list("./src")
  .filter((record) => !record.includes("spec"))
  .filter((record) => !record.includes("demo"))
  .forEach((record) => allFile.add(record))

function log() {
  console.log(
    chalk.redBright(
      [...allFile.values()]
        .map((v, idx) => `[${idx}].${v.split(current).join("")}`)
        .join("\n")
    )
  )
  console.log(
    `${chalk.red("×")} ${chalk.dim.white(`${allFile.size} unused files`)}`
  )
}

export default function unused(): Plugin {
  return {
    name: "find-unused-file",

    load(id) {
      if (allFile.has(id)) {
        allFile.delete(id)
      }
      return null
    },

    buildEnd() {
      log()
    },
  }
}
