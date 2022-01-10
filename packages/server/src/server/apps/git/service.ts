import { inject, injectable, singleton } from "tsyringe"
import NodeGit from "nodegit"
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

async function openRepo(repoPath: string) {
  return await NodeGit.Repository.open(repoPath)
}

async function isClean(cwd: string) {
  const repo = await openRepo(cwd)
  const status = await repo.getStatus()
  return !status.length
}

async function hasRepo(repoPath: string) {
  return !!(await openRepo(repoPath).catch((err) => null))
}

async function hasRemtoe(repoPath: string) {
  const repo = await openRepo(repoPath)
  const remotes = await Promise.all(
    (
      await NodeGit.Remote.list(repo)
    ).map((name) => {
      return NodeGit.Remote.lookup(repo, name)
    })
  )
  return !!remotes.length
}

@injectable()
@singleton()
export class GitService {
  constructor(@inject(StorageService) private storage: StorageService) {}
  async sync() {
    const base = this.storage.get<string>(HEXO_BASE_DIR_KEY)
    const cwd = toRealPath(base)
    if (!hasRepo(cwd)) return
    await run("git", ["reset", "--hard"], { cwd }).catch((err) => {
      console.error(err)
      throw new ResetHardError()
    })
    if (hasRemtoe(cwd)) {
      await run("git", ["pull"], { cwd }).catch((err) => {
        console.error(err)
        throw new PullError()
      })
    }
  }
  async save() {
    const base = this.storage.get<string>(HEXO_BASE_DIR_KEY)
    const cwd = toRealPath(base)
    if (!hasRepo(cwd)) return
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
    if (hasRemtoe(cwd))
      await run("git", ["push"], { cwd }).catch((err) => {
        console.error(err)
        throw new PushError()
      })
  }
}
