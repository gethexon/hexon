/**
 * config app entrance
 */

import compose from "koa-compose"
import mount from "koa-mount"
import install, { checkInstall } from "./install"
import health from "./health"
import git from "./git"
import settingsRouter from "../routes/settings-router"
import templateRouter from "../routes/template"

/**
 * @deprecated 以后慢慢挪出去
 */
export default compose([
  mount("/install", install),
  checkInstall(),
  mount("/health", health),
  mount("/git", git),
  settingsRouter.routes(),
  templateRouter.routes(),
])
