import { Context, Request } from "koa";

export interface CustomRequest extends Request {
  body: {
    [key: string]: any;
  };
}

export interface CustomContext extends Context {
  body: {
    [key: string]: any;
  };
}
