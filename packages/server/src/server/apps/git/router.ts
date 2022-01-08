import { container } from "tsyringe";
import Router from "@koa/router";
import { GitService } from "./service";

const router = new Router();

router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (
      [
        "RepoOpenError",
        "ResetHardError",
        "PullError",
        "AddAllError",
        "CreateCommitError",
        "PushError",
      ].includes(err)
    ) {
      ctx.status = 500;
      ctx.body = err.name as string;
      return;
    }
    throw err;
  }
});

router.post("/sync", async (ctx) => {
  const git = container.resolve(GitService);
  await git.sync();
  ctx.status = 200;
});

router.post("/save", async (ctx) => {
  const git = container.resolve(GitService);
  await git.save();
  ctx.status = 200;
});

export default router;
