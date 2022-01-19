import { container } from "tsyringe"
import chalk from "chalk"
import dayjs from "dayjs"
const DEFAULT_DATE_FORMAT = "YYYY-MM-DD hh:mm:ss.SSS"

export class LogService {
  private scope = ""
  private dateFormat = DEFAULT_DATE_FORMAT
  _prefix(type: "green" | "red") {
    let prefix = ""
    this.scope && (prefix += chalk[type].bold(`[${this.scope}]`))
    prefix += chalk.blue(`[${dayjs().format(this.dateFormat)}]`)
    return prefix
  }
  private _log(...args: any[]) {
    console.log(...args)
  }
  private _error(...args: any[]) {
    console.error(...args)
  }
  setScope(scope: string) {
    this.scope = scope
  }
  log(...args: any[]) {
    this._log(this._prefix("green"), ...args)
  }
  error(...args: any[]) {
    this._error(this._prefix("red"), ...args)
  }
  logWithUser(user: { username: string; slug: string }, ...args: any[]) {
    this._log(
      this._prefix("green") +
        chalk.yellow.dim(`[${user.username}:${user.slug}]`),
      ...args
    )
  }

  static create(scope: string) {
    const instance = container.resolve(LogService)
    instance.setScope(scope)
    return instance
  }
}
