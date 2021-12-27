import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import account from "./account"
import { isInstalled } from "./api"

const path = {
  home: "/",
  signin: "/signin",
  install: "/install",
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("./pages/HomePage.vue"),
    name: "home",
    children: [
      {
        path: "view/:type/:source",
        component: () => import("./views/ViewerView.vue"),
        name: "view",
      },
    ],
  },
  {
    path: "/edit/:type/:source",
    component: () => import("./views/EditorView.vue"),
    name: "edit",
  },
  {
    path: path.signin,
    component: () => import("./pages/SignInPage.vue"),
  },
  {
    path: path.install,
    component: () => import("./pages/InstallPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
]

const router = createRouter({ history: createWebHashHistory(), routes })

let checked = false
let installed = false
router.beforeEach(async (to, from) => {
  if (!checked) {
    installed = await isInstalled()
    checked = true
  }
  if (!installed) {
    if (to.path !== path.install) return path.install
    else return true
  } else {
    if (to.path === path.install) return path.home
  }
  if (account.isSignedIn) {
    if (to.path === path.signin) return path.home
    else return true
  } else {
    if (to.path !== path.signin) return path.signin
    else return true
  }
})

export default router
