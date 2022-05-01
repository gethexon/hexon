import Debug from "debug"
import path from "path"

export const DEV = process.env.NODE_ENV !== "production"

export function createDebug(scope: string) {
  return Debug(`@hexon/server:${scope}`)
}

export const noop = () => {}

export function expandHomeDir(fullpath: string) {
  console.log("expandHomeDir", fullpath, fullpath.length, fullpath.split(""))
  const homedir =
    process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]!

  if (!fullpath) return fullpath
  console.log(1)
  if (fullpath == "~") return homedir
  console.log(fullpath.slice(0, 2))
  if (fullpath.slice(0, 2) != "~/") return fullpath
  console.log(3)
  return path.join(homedir, fullpath.slice(2))
}
