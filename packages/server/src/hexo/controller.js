import Joi from "joi";
import DI from "../util/di.js";
import { IHexo } from "./core/hexo.js";
import { search } from "./search.js";
export const v = {
  generate: Joi.object({
    deploy: Joi.boolean(),
    watch: Joi.boolean(),
    bail: Joi.boolean(),
    force: Joi.boolean(),
    concurrency: Joi.boolean(),
  }),
  deploy: Joi.object({
    generate: Joi.boolean(),
  }),
  new: Joi.object({
    title: Joi.string().required(),
    layout: Joi.string(),
    path: Joi.string(),
    slug: Joi.string(),
    replace: Joi.boolean(),
  }),
  update: Joi.object({
    id: Joi.string().required(),
    page: Joi.boolean(),
    obj: Joi.object().required(),
  }),
  delete: Joi.object({
    id: Joi.string().required(),
    page: Joi.boolean(),
  }),
  publish: Joi.object({
    id: Joi.string().required(),
  }),
};
export const qv = {
  search: Joi.object({
    query: Joi.string(),
    mode: Joi.string(),
  }),
};
export const generate = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.generate(ctx.request.body);
  ctx.status = 200;
};
export const deploy = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.deploy(ctx.request.body);
  ctx.status = 200;
};
export const clean = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.clean();
  ctx.status = 200;
};
export const listPost = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  ctx.body = await hexo.listPost();
};
export const listPage = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  ctx.body = await hexo.listPage();
};
export const listTag = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  ctx.body = await hexo.listTag();
};
export const listCategory = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  ctx.body = await hexo.listCategory();
};
const new$0 = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  const { title, layout, path, slug, replace } = ctx.request.body;
  const res = await hexo.new(title, { layout, path, slug, replace });
  ctx.status = 200;
  ctx.body = res;
};
export const update = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  const { id, page, obj } = ctx.request.body;
  const res = await hexo.write(id, obj, page);
  ctx.status = 200;
  ctx.body = res;
};
const delete$0 = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  const { id, page } = ctx.request.body;
  await hexo.delete(id, page);
  ctx.status = 200;
};
export const publish = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  const { id } = ctx.request.body;
  const res = await hexo.publish(id);
  ctx.body = res;
  ctx.status = 200;
};
export const gitSync = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.gitSync();
  ctx.status = 200;
};
export const gitSave = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.gitSave();
  ctx.status = 200;
};
export const notGitRepo = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    // TODO 其他平台和git版本如何检测
    if (e.message.indexOf("not a git repo") > -1) {
      ctx.status = 503;
      ctx.body = {
        message: "not a git repo",
      };
    } else throw e;
  }
};
const search$0 = async (ctx, next) => {
  ctx.body = await search(decodeURIComponent(ctx.query.query), ctx.query.mode);
};
export { new$0 as new };
export { delete$0 as delete };
export { search$0 as search };
