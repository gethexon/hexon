import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/zh-cn"

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.locale("zh-cn")
