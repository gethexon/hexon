import Debug from "debug"
import path from "path"

export const DEV = process.env.NODE_ENV !== "production"

export function createDebug(scope: string) {
  return Debug(`@hexon/server:${scope}`)
}

export const noop = () => {}

export function expandHomeDir(fullpath: string) {
  const homedir =
    process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]!

  if (!fullpath) return fullpath
  if (fullpath == "~") return homedir
  if (fullpath.slice(0, 2) != "~/") return fullpath
  return path.join(homedir, fullpath.slice(2))
}
