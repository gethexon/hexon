/**
 * config app entrance
 */

import compose from "koa-compose";
import mount from "koa-mount";
import users from "./apps/admin/app";
import install from "./apps/install";
import health from "./apps/health";
import hexo from "./apps/hexo/app";

export default compose([
  mount("/", users),
  mount("/install", install),
  mount("/health", health),
  mount("/", hexo),
]);