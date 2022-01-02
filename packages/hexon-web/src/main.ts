import { createApp } from "vue"
import App from "./App.vue"
import themes from "./themes"
import theme from "./plugins/theme"
import account from "./plugins/account"
import router from "./plugins/router"
import notification from "./plugins/notification"
import dialog from "./plugins/dialog"
import pinia from "./plugins/pinia"
import "./plugins/dayjs"

createApp(App)
  .use(pinia)
  .use(router)
  .use(themes)
  .use(theme)
  .use(notification)
  .use(dialog)
  .use(account)
  .mount("#app")
