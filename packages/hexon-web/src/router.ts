import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import account from "./account";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("./pages/HomePage.vue"),
    children: [
      {
        path: "view/:type/:source",
        component: () => import("./views/ViewerView.vue"),
        name: "view",
      },
    ],
  },
  {
    path: "/signin",
    component: () => import("./pages/SignInPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach(
  account.beforeEachGuard({
    home: "/",
    signin: "/signin",
  })
);

export default router;
