import { Context, Next } from "koa";
import { Error2 } from "./utils";

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error2) {
      ctx.status = err.status;
      ctx.body = err.message;
    } else {
      ctx.status = 500;
      ctx.body = "server internal error";
      console.error(err);
    }
  }
};
