import { IUserInfo } from ".";

declare module "koa" {
  interface DefaultState {
    user?: IUserInfo & { type: "access" | "refresh" };
  }
}
