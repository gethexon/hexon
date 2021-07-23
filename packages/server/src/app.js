import Koa from "koa";
import json from "koa-json";
import onerror from "koa-onerror";
import bodyparser from "koa-bodyparser";
import koaLogger from "koa-logger";
import "./auth/authService.js";
import "./install/installService.js";
import "./hexo/core/index.js";
import DI from "./util/di.js";
import { ILogService } from "./base/logService.js";
import koaStatic from "koa-static";
import { resolve } from "path";
import install from "./install/router.js";
import auth from "./auth/router.js";
import { jwtAuth, requestAccessToken } from "./auth/controller.js";
import hexo from "./hexo/router.js";
const app = new Koa();
const logService = DI.inject(ILogService);
const serverLogger = logService.get('server');
const httpLogger = logService.get('http');
// error handler
onerror(app);
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 500 && process.env.NODE_ENV !== 'development') {
            ctx.body.message = 'server internal error. Fix problem and try again later. This can be caused by unexpected input or server error.';
            serverLogger.error(500, err);
            return;
        }
        ctx.body = {
            message: err.message
        };
    }
});
// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(koaLogger((str, args) => {
    // redirect koa logger to other output pipe
    // default is process.stdout(by console.log function)
    httpLogger.info(str);
}));
app.use(koaStatic({ resolve }.resolve(__dirname, '../../web/dist/pwa')));
app.use(install.routes(), install.allowedMethods());
app.use(auth.routes(), auth.allowedMethods());
app.use(jwtAuth);
app.use(requestAccessToken);
app.use(hexo.routes(), hexo.allowedMethods());
export default app;
