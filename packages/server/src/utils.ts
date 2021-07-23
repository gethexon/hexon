import Debug from "debug";
import { Context } from "koa";

export const DEV = process.env.NODE_ENV !== "production";

export function createDebug(scope: string) {
  return Debug(`hexon-server:${scope}`);
}

export function createErrorReporter(name: string = "Unknown") {
  return (message: string) => {
    const err = new Error(message);
    err.name = name + "Error";
    throw err;
  };
}

class ResponseError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

const debugEnd = createDebug("end");

export function end(status: number, message: string) {
  debugEnd(`${message}`);
  const err = new ResponseError(status, message);
  err.status = status;
  throw err;
}

export function resolveAuthorizationHeader(ctx: Context) {
  if (!ctx.header || !ctx.header.authorization) {
    end(400, "auth header required");
  }

  const parts = ctx.header.authorization.split(" ");

  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  end(400, "Authtication Error");
}

export const noop = () => {};

export function check(
  err: Error,
  query: string,
  code: number,
  message: string = err.message
) {
  if (err.message.indexOf(query) > -1) end(code, message);
}
