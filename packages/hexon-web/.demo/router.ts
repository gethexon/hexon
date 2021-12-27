import { RouteRecordRaw } from "vue-router"
import { createWebHashHistory } from "vue-router"
import { createRouter } from "vue-router"
import { getNameFromPath, modules } from "./utils"
export const demos: RouteRecordRaw[] = Object.entries(modules).map(
  ([path, imp]) => {
    return {
      path: encodeURIComponent(path),
      component: imp,
      meta: {
        name: getNameFromPath(path),
      },
    }
  }
)
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("./Layout.vue"),
    children: [
      ...demos,
      { path: "", component: () => import("./Welcome.vue") },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
]
export const router = createRouter({ history: createWebHashHistory(), routes })
