/**
 * config app entrance
 */

import compose from "koa-compose";
import mount from "koa-mount";
import install from "./install";
import health from "./health";
import hexo from "./hexo";

export default compose([
  mount("/install", install),
  mount("/health", health),
  mount("/", hexo),
]);
