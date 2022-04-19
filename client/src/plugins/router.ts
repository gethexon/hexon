import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import { isInstalled } from "../api"
import { isLogin } from "~/api/auth"
import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"

const routes = setupLayouts(generatedRoutes)

const path = {
  home: "/",
  signin: "/signin",
  install: "/install",
}

const router = createRouter({ history: createWebHashHistory(), routes })

let checked = false
let installed = false
router.beforeEach(async (to, from) => {
  if (!checked) {
    installed = await isInstalled()
    checked = true
  }
  if (!installed && to.path !== path.install) return path.install
  if (installed && to.path === path.install) return path.home
  if (isLogin() && to.path === path.signin) return path.home
  if (!isLogin() && to.path !== path.signin) return path.signin
})

export default router
