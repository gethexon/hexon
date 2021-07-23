import Joi from "joi";
import DI from "../util/di.js";
import { IInstallService } from "./installService.js";
export const v = {
    install: Joi.object({
        secret: Joi.string().required(),
        expire: Joi.string().required(),
        refresh: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required()
    })
};
export const checkInstalled = async (ctx, next) => {
    const installService = DI.inject(IInstallService);
    const installed = installService.checkInstalled();
    if (installed) {
        ctx.status = 404;
    }
    else
        await next();
};
export const notInstalled = async (ctx, next) => {
    ctx.status = 200;
};
export const install = async (ctx, next) => {
    const installService = DI.inject(IInstallService);
    const { secret, expire, refresh, username, password } = ctx.request.body;
    await installService.install({ secret, expire, refresh, username, password });
    ctx.status = 200;
};
