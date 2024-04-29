import { inject , injectable , singleton } from "tsyringe"
import { StorageService } from "@server-shared/storage-service"
import { scriptStore } from "@server-shared/store"
import { toRealPath } from "@server-shared/utils"
import { LogService } from "@server-shared/log-service"
import { run } from "@server/utils/exec"
import { ScriptError } from "../errors"
import { ExecService } from "./exec-service"
import { HexoInstanceService } from "./hexo-instance-service"
import { HEXO_BASE_DIR_KEY } from "@server-shared/constants"

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
    @inject(LogService) private _logService: LogService,
    @inject(ExecService) private _execService: ExecService
  ) {
    this._logService.setScope("git-service")
  }
  async sync() {
    if (scriptStore.hasScript("git-sync"))
      return this._execService
        .run(scriptStore.getScript("git-sync"))
        .catch((err) => {
          this._logService.error(err)
          throw new ScriptError(
            "fail to run git sync script",
            "GitSyncScriptError"
          )
        })
    const base = this.storage.get<string>(HEXO_BASE_DIR_KEY)
    const cwd = toRealPath(base)
    if (!(await hasRepo(cwd))) {
      this._logService.log("not git repo, skipped")
      return
    }
    await run("git", ["reset", "--hard"], { cwd }).catch((err) => {
      this._logService.error(err)
      this._logService.error("git reset hard error")
      throw err
    })
    this._logService.log("git reset succeed")
    if (await hasRemtoe(cwd)) {
      await run("git", ["pull"], { cwd }).catch((err) => {
        this._logService.error(err)
        this._logService.error("git pull error")
        throw err
      })
    } else {
      this._logService.log("no remote detected, skip pull")
    }
    this._logService.log("sync succeed")
  }

  async save() {
    if (scriptStore.hasScript("git-save"))
      return this._execService
        .run(scriptStore.getScript("git-save"))
        .catch((err) => {
          this._logService.error(err)
          throw new ScriptError(
            "fail to run git save script",
            "GitSaveScriptError"
          )
        })
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
      throw err
    })
    this._logService.log("git add succeed")
    await run(
      "git",
      ["commit", "-m", `server update ${new Date().toString()}`],
      { cwd }
    ).catch((err) => {
      this._logService.error(err)
      this._logService.error("git commit error")
      throw err
    })
    this._logService.log("git commit succeed")
    if (await hasRemtoe(cwd)) {
      await run("git", ["push"], { cwd }).catch((err) => {
        this._logService.error(err)
        this._logService.error("git push error")
        throw err
      })
    } else {
      this._logService.log("no remote detected, skip push")
    }
    this._logService.log("save succeed")
  }
}
