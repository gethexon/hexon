import { Context, Middleware, Next } from "koa";
import jwt from "jsonwebtoken";
import { getAuthInfo, IInternalUserInfo, isBlocked } from "./storage";
import { debug, end } from "./utils";

export function resolveAuthorizationHeader(ctx: Context) {
  if (!ctx.header || !ctx.header.authorization) {
    end(401, "Authtication Error");
  }

  const parts = ctx.header.authorization.split(" ");

  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  end(401, "Authtication Error");
}

type tokenType = "access" | "refresh";

export const auth: (type?: tokenType) => Middleware =
  (type: tokenType = "access") =>
  async (ctx: Context, next: Next) => {
    const token = resolveAuthorizationHeader(ctx);
    if (isBlocked(token)) {
      debug("token has been blocked");
      end(401, "Authentication Error");
    }
    try {
      jwt.verify(token, getAuthInfo().secret);
    } catch (err) {
      if (["JsonWebTokenError", "TokenExpiredError"].includes(err.name)) {
        debug(`fail to verify token`);
        end(401, "Authentication Error");
      } else throw err;
    }
    const user = jwt.decode(token);

    if (
      typeof user !== "string" &&
      typeof user.username === "string" &&
      typeof user.type === "string" &&
      (user.type === "access" || user.type === "refresh")
    ) {
      if (user.type !== type) {
        debug(`wrong token type: ${type} is required but found ${user.type}`);
        end(401, "Authentication Error");
      } else {
        ctx.state.user = { username: user.username, type: user.type };
        await next();
      }
    } else {
      debug(`fail to decode token: `, user);
      throw new Error("TokenDecodeError");
    }
  };

export const sign = (user: IInternalUserInfo) => {
  debug(`sign for ${user.username}`);
  const authInfo = getAuthInfo();
  const accessToken = jwt.sign(
    { username: user.username, type: "access" },
    authInfo.secret,
    {
      expiresIn: authInfo.expiresIn,
    }
  );
  const refreshToken = jwt.sign(
    { username: user.username, type: "refresh" },
    authInfo.secret,
    {
      expiresIn: authInfo.refreshableIn,
    }
  );
  return { accessToken, refreshToken };
};
