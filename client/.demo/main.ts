import { createApp } from "vue"
import App from "./App.vue"
import themes from "~/themes"
import theme from "~/plugins/theme"
import notification from "~/plugins/notification"
import dialog from "~/plugins/dialog"
import "~/plugins/dayjs"
import { router } from "./router"

createApp(App)
  .use(router)
  .use(themes)
  .use(theme)
  .use(notification)
  .use(dialog)
  .mount("#app")
