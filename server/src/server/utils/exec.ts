import { execa, Options } from "execa"
import { container } from "tsyringe"
import { LogService } from "@/services/log-service"

const execLogService = container.resolve(LogService)
execLogService.setScope("exec-service")

export async function run(command: string, args: string[] = [], opt?: Options) {
  execLogService.log(`run ${command} ${args.join(" ")}`)
  return (await execa(command, args, { ...opt, stdio: "pipe" })).stdout
}
