import { createPinia } from "pinia"
import router from "./router"
import dialog from "./dialog"
import notification from "./notification"

const pinia = createPinia()
pinia.use(() => ({
  dialog,
  router,
  notification,
}))

export default pinia
