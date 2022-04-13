/**
 * config app entrance
 */

import compose from "koa-compose"
import mount from "koa-mount"
import install, { checkInstall } from "./install"
import health from "./health"
import hexo from "./hexo"
import git from "./git"
import settingsRouter from "../routers/settings-router"
import templateRouter from "../routers/template"
import { auth } from "../middlewares/auth"

export default compose([
  mount("/install", install),
  checkInstall(),
  auth.auth,
  mount("/health", health),
  mount("/hexo", hexo),
  mount("/git", git),
  settingsRouter.routes(),
  templateRouter.routes(),
])
