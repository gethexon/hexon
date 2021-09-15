import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { beforeEachGuard } from "./lib/account";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: () => import("./pages/HomePage.vue"),
  },
  {
    path: "/signin",
    component: () => import("./pages/SignInPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
];

const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach(
  beforeEachGuard({
    home: "/home",
    signin: "/signin",
  })
);

export default router;
