import { createPinia } from "pinia"
import router from "./router"
import dialog from "./dialog"
import notification from "./notification"
import modal from "./modal"

const pinia = createPinia()
pinia.use(() => ({
  dialog,
  router,
  notification,
  modal,
}))

export default pinia
