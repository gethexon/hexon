import Router from "@koa/router"

import health from "./health"
import hexo from "./hexo"
import git from "./git"
import settings from "./settings"
import template from "./template"
import { auth } from "../middlewares/auth"

const router = new Router()

router.use(auth.auth)
router.use(health.routes())
router.use(hexo.routes())
router.use(git.routes())
router.use(settings.routes())
router.use(template.routes())

export default router
