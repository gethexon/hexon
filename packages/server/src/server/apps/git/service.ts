import { inject, injectable, singleton } from "tsyringe"
import { HEXO_BASE_DIR_KEY } from "~/shared/constants"
import { StorageService } from "~/shared/storage-service"
import { toRealPath } from "~/shared/utils"
import { run } from "../hexo/utils"
import {
  ResetHardError,
  PullError,
  AddAllError,
  CreateCommitError,
  PushError,
} from "./errors"

async function isClean(repoPath: string) {
  return !(await run("git", ["status", "-s"], { cwd: repoPath }))
}

async function hasRepo(repoPath: string) {
  return run("git", ["rev-parse", "--is-inside-work-tree"], {
    cwd: repoPath,
  }).then(
    () => true,
    () => false
  )
}

async function hasRemtoe(repoPath: string) {
  return !!(await run("git", ["remote", "-v"], { cwd: repoPath }))
}

@injectable()
@singleton()
export class GitService {
  constructor(@inject(StorageService) private storage: StorageService) {}
  async sync() {
    const base = this.storage.get<string>(HEXO_BASE_DIR_KEY)
    const cwd = toRealPath(base)
    if (!(await hasRepo(cwd))) return
    await run("git", ["reset", "--hard"], { cwd }).catch((err) => {
      console.error(err)
      throw new ResetHardError()
    })
    if (await hasRemtoe(cwd)) {
      await run("git", ["pull"], { cwd }).catch((err) => {
        console.error(err)
        throw new PullError()
      })
    }
  }
  async save() {
    const base = this.storage.get<string>(HEXO_BASE_DIR_KEY)
    const cwd = toRealPath(base)
    if (!(await hasRepo(cwd))) return
    if (await isClean(cwd)) return
    await run("git", ["add", ".", "--all"], { cwd }).catch((err) => {
      console.error(err)
      throw new AddAllError()
    })
    await run(
      "git",
      ["commit", "-m", `server update ${new Date().toString()}`],
      { cwd }
    ).catch((err) => {
      console.error(err)
      throw new CreateCommitError()
    })
    if (await hasRemtoe(cwd))
      await run("git", ["push"], { cwd }).catch((err) => {
        console.error(err)
        throw new PushError()
      })
  }
}
