import fs from "fs"
import path from "path"

export const noop = () => {}

export function isBlog(cwd: string): boolean {
  let file
  try {
    // 检查是否有对应文件
    file = fs.readFileSync(path.join(cwd, "package.json"), {
      encoding: "utf-8",
    })
    fs.readFileSync(path.join(cwd, "_config.yml"), { encoding: "utf-8" })
  } catch (err) {
    if (err.code === "ENOENT") {
      return false
    }
    throw err
  }
  // 检查是否有hexo依赖
  const packageJSON = JSON.parse(file)
  if (!packageJSON?.dependencies?.hexo) return false
  return true
}

export function toRealPath(value: string) {
  return path.isAbsolute(value)
    ? value
    : path.resolve(process.cwd(), "../..", value)
}
