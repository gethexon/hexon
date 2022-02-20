import { inject, injectable, singleton } from "tsyringe"
import {
  AddAllError,
  CreateCommitError,
  PullError,
  PushError,
  ResetHardError,
} from "@/apps/git/errors"
import { run } from "@/apps/hexo/utils"
import { LogService } from "@/services/log-service"
import { HEXO_BASE_DIR_KEY } from "~/shared/constants"
import { StorageService } from "~/shared/storage-service"
import { toRealPath } from "~/shared/utils"

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
  constructor(
    @inject(StorageService) private storage: StorageService,
    @inject(LogService) private _logService: LogService
  ) {
    this._logService.setScope("git-service")
  }
  async sync() {
    const base = this.storage.get<string>(HEXO_BASE_DIR_KEY)
    const cwd = toRealPath(base)
    if (!(await hasRepo(cwd))) {
      this._logService.log("not git repo, skipped")
      return
    }
    await run("git", ["reset", "--hard"], { cwd }).catch((err) => {
      this._logService.error(err)
      this._logService.error("git reset hard error")
      throw new ResetHardError()
    })
    this._logService.log("git reset succeed")
    if (await hasRemtoe(cwd)) {
      await run("git", ["pull"], { cwd }).catch((err) => {
        console.error(err)
        throw new PullError()
      })
    } else {
      this._logService.log("no remote detected, skip pull")
    }
    this._logService.log("sync succeed")
  }

  async save() {
    const base = this.storage.get<string>(HEXO_BASE_DIR_KEY)
    const cwd = toRealPath(base)
    if (!(await hasRepo(cwd))) {
      this._logService.log("not git repo, skipped")
      return
    }
    if (await isClean(cwd)) {
      this._logService.log("work space clean no need to save")
      return
    }
    await run("git", ["add", ".", "--all"], { cwd }).catch((err) => {
      this._logService.error(err)
      this._logService.error("git add all error")
      throw new AddAllError()
    })
    this._logService.log("git add succeed")
    await run(
      "git",
      ["commit", "-m", `server update ${new Date().toString()}`],
      { cwd }
    ).catch((err) => {
      this._logService.error(err)
      this._logService.error("git commit error")
      throw new CreateCommitError()
    })
    this._logService.log("git commit succeed")
    if (await hasRemtoe(cwd)) {
      await run("git", ["push"], { cwd }).catch((err) => {
        this._logService.error(err)
        this._logService.error("git push error")
        throw new PushError()
      })
    } else {
      this._logService.log("no remote detected, skip push")
    }
    this._logService.log("save succeed")
  }
}
