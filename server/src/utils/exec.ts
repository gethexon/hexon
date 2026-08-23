import { execa, Options } from "execa"
import strip from "strip-ansi"
import { container } from "tsyringe"
import { LogService } from "@server-shared/log-service"

const execLogService = container.resolve(LogService)
execLogService.setScope("exec-service")

export function getExecErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return String(error)
  const commandError = error as Error & {
    stderr?: string
    stdout?: string
    shortMessage?: string
  }
  const output = [commandError.stderr, commandError.stdout]
    .filter(Boolean)
    .join("\n")
    .trim()
  return output || commandError.shortMessage || commandError.message
}

export async function run(
  command: string,
  args: string[] = [],
  opt: Options & {
    stripAnsi?: boolean
  } = { stripAnsi: false }
) {
  const { stripAnsi, ...execOpt } = opt
  execLogService.log(`run ${command} ${args.join(" ")}`)
  const { stdout } = await execa(command, args, { ...execOpt, stdio: "pipe" })
  if (stripAnsi) return strip(stdout)
  return stdout
}
