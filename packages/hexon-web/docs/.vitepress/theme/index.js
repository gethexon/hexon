import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/zh-cn"
import DefaultTheme from "vitepress/theme"
import Layout from "./Layout.vue"
import themes from "~/themes"
import notification from "~/notification"
import { createPinia } from "pinia"

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.locale("zh-cn")

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(themes)
    app.use(notification)
    app.use(createPinia())
  },
}
