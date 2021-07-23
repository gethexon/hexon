import Router from "koa-router";
import { validateRequestBody } from "../util/middlewares.js";
import * as controller from "./controller.js";
const router = new Router();
router.prefix('/install');
router.use(controller.checkInstalled);
router.get('/', controller.notInstalled);
router.post('/', validateRequestBody(controller.v.install), controller.install);
export default router;
