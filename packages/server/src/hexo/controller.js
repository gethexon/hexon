const Joi = require("joi");
const DI = require("../util/di");
const { IHexo } = require("./core/hexo");
const { search } = require("./search");

// #region validate
exports.v = {
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
exports.qv = {
  search: Joi.object({
    query: Joi.string(),
    mode: Joi.string(),
  }),
};
// #endregion

// #region actions
exports.generate = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.generate(ctx.request.body);
  ctx.status = 200;
};
exports.deploy = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.deploy(ctx.request.body);
  ctx.status = 200;
};
exports.clean = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.clean();
  ctx.status = 200;
};
// #endregion

// #region list
exports.listPost = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  ctx.body = await hexo.listPost();
};
exports.listPage = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  ctx.body = await hexo.listPage();
};
exports.listTag = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  ctx.body = await hexo.listTag();
};
exports.listCategory = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  ctx.body = await hexo.listCategory();
};
// #endregion

// #region new
exports.new = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  const { title, layout, path, slug, replace } = ctx.request.body;
  const res = await hexo.new(title, {
    layout,
    path: path?.split("\\").join("/"),
    slug,
    replace,
  });
  ctx.status = 200;
  ctx.body = res;
};
// #endregion

// #region update
exports.update = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  const { id, page, obj } = ctx.request.body;
  const res = await hexo.write(id, obj, page);
  ctx.status = 200;
  ctx.body = res;
};
// #endregion

// #region delete
exports.delete = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  const { id, page } = ctx.request.body;
  await hexo.delete(id, page);
  ctx.status = 200;
};
// #endregion

// #region publish
exports.publish = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  const { id } = ctx.request.body;
  const res = await hexo.publish(id);
  ctx.body = res;
  ctx.status = 200;
};
// #endregion

// #region git
exports.gitSync = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.gitSync();
  ctx.status = 200;
};
exports.gitSave = async (ctx, next) => {
  const hexo = DI.inject(IHexo);
  await hexo.gitSave();
  ctx.status = 200;
};
exports.notGitRepo = async (ctx, next) => {
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
// #endregion
// #region search
exports.search = async (ctx, next) => {
  ctx.body = await search(decodeURIComponent(ctx.query.query), ctx.query.mode);
};
// #endregion
