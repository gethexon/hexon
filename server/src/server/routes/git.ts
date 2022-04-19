import { container } from "tsyringe"
import Router from "@koa/router"
import { GitService } from "@/services/git-service"

const router = new Router()

router.prefix("/git")

router.post("/sync", async (ctx) => {
  const git = container.resolve(GitService)
  await git.sync()
  ctx.status = 200
})

router.post("/save", async (ctx) => {
  const git = container.resolve(GitService)
  await git.save()
  ctx.status = 200
})

export default router
