import { createPinia } from "pinia"
import { createApp } from "vue"
import account from "./account"
import App from "./App.vue"
import router from "./router"
import themes from "./themes"
import notification from "./notification"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/zh-cn"

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.locale("zh-cn")

createApp(App)
  .use(router)
  .use(createPinia())
  .use(themes)
  .use(notification)
  .use(account)
  .mount("#app")
