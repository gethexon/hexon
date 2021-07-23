// 只能使用 base services

import { Context, Next } from "koa";
import { container } from "tsyringe";
import { ITokenService, TokenService } from "../services/token";
import { end, resolveAuthorizationHeader } from "../utils";
const tokenService: ITokenService = container.resolve(TokenService);

export async function requireAccessToken(ctx: Context, next: Next) {
  const token = resolveAuthorizationHeader(ctx);
  if (!token) end(400, "require bearer token");

  try {
    tokenService.verifyToken(token, "access");
  } catch (err) {
    if (err.message.includes("invalid signature"))
      end(401, "invalid signature");
    if (err.name === "TokenExpiredError") end(401, "token expired");
    else throw err;
  }
  await next();
}
