import { createPinia } from "pinia"
import router from "./router"
import dialog from "./dialog"
import notification from "./notification"
import modal from "./modal"
import loading from "./loading"

const pinia = createPinia()
pinia.use(() => ({
  loading,
  dialog,
  router,
  notification,
  modal,
}))

export default pinia
