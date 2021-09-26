import path from "path";
import { Context, Next } from "koa";
import serve from "koa-static";

export function statics(root: string) {
  return async (ctx: Context, next: Next) => {
    await serve(root, {
      setHeaders: (res, fullpath, stats) => {
        const isHtml = path.extname(fullpath).toLowerCase() === ".html";
        if (isHtml) ctx.set("Cache-Control", "no-cache");
        else ctx.set("Cache-Control", "max-age=31536000");
      },
    })(ctx, next);
  };
}

export default statics;
