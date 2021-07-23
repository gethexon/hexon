import Router from "@koa/router";
import auth from "basic-auth";
import { UserService } from "../services/users";
import {
  end,
  resolveAuthorizationHeader,
  check,
  createDebug,
} from "../../../utils";
import { container } from "tsyringe";
import { CustomContext, CustomRequest } from "../../../types";
import { requireAccessToken } from "../../../middlewares/auth";

const debug = createDebug("app:admin");

const userService = container.resolve(UserService);

const router = new Router();

router.post("/signin", (ctx: CustomContext) => {
  const user = auth.parse(ctx.request.headers.authorization);
  if (!user) end(401, "basic auth is required");
  let info;
  try {
    info = userService.signIn(user.name, user.pass);
  } catch (err) {
    check(err, "user not found", 401);
    throw err;
  }
  ctx.body = info;
});

// /**
//  * just set in databast.json
//   {
//       "username": "admin",
//       "password": "7b2e9f54cdff413fcde01f330af6896c3cd7e6cd",
//        // admin
//        // SHA1('admin') = d033e22ae348aeb5660fc2140aec35850c4da997
//   }
//   */
// router.post("/signup", (ctx: CustomContext) => {
//   const { username, password } = (ctx.request as CustomRequest).body;
//   if (!username || !password) end(400, "invalid params");
//   let info;
//   try {
//     info = userService.signUp(username, password);
//   } catch (err) {
//     check(err, "exists", 401);
//     throw err;
//   }
//   ctx.body = info;
// });

router.post("/refresh", (ctx) => {
  const token = resolveAuthorizationHeader(ctx);
  let info;
  try {
    info = userService.refresh(token);
  } catch (err) {
    check(err, "expired", 401);
    check(err, "require refresh token", 400);
    throw err;
  }
  ctx.body = info;
});

router.get("/info", requireAccessToken, (ctx) => {
  const token = resolveAuthorizationHeader(ctx);
  ctx.body = userService.getInfo(token);
});

export default router;
