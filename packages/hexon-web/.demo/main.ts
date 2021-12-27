import { createApp } from "vue"
import App from "./App.vue"
import themes from "~/themes"
import notification from "~/plugins/notification"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/zh-cn"
import { router } from "./router"
import dialog from "~/plugins/dialog"

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.locale("zh-cn")

createApp(App)
  .use(router)
  .use(themes)
  .use(notification)
  .use(dialog)
  .mount("#app")
