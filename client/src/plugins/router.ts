import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import { isLogin } from "~/api/auth"
import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"

const routes = setupLayouts(generatedRoutes)

const path = {
  home: "/",
  signin: "/signin",
  says: "/says",
}

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach(async (to, from) => {
  if (isLogin() && to.path === path.signin) return path.home
  if (!isLogin() && to.path !== path.signin) return path.signin
})

export default router
