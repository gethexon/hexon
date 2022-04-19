import { cookies } from "~/composables/cookies"
import { forceReloadWindow } from "~/utils"
import { request } from "./instance"

export function isLogin() {
  return Boolean(cookies.get("token"))
}

export function login(username: string, password: string) {
  return request.post("/auth/login", { username, password })
}

export function logout() {
  cookies.remove("token")
  forceReloadWindow()
}

export function getInfo() {
  return request
    .post("/auth/info")
    .then((res) => res.data as { username: string })
}

export function changePassword(oldPassword: string, password: string) {
  return request.post("/auth/password", { oldPassword, password })
}

export function changeUsername(username: string) {
  return request.post("/auth/username", { username })
}
