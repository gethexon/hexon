import { createApp } from "vue"
import App from "./App.vue"
import dialog from "./plugins/dialog"
import loading from "./plugins/loading"
import modal from "./plugins/modal"
import notification from "./plugins/notification"
import pinia from "./plugins/pinia"
import router from "./plugins/router"
import theme from "./plugins/theme"
import themes from "./themes"
import "./plugins/dayjs"

createApp(App)
  .use(loading)
  .use(pinia)
  .use(router)
  .use(themes)
  .use(theme)
  .use(modal)
  .use(notification)
  .use(dialog)
  .mount("#app")
