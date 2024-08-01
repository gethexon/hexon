import { IRSaysListData } from "@/says/interface"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export function sortSaysByTime(
  says: IRSaysListData[]
): IRSaysListData[] {
  return says.sort((a, b) => {
    const da = dayjs(a.date, "YYYY-MM-DD H:mm")
    const db = dayjs(b.date, "YYYY-MM-DD H:mm")
    if (!da.isValid()) return -1
    if (!db.isValid()) return 1
    return da.valueOf() > db.valueOf() ? -1 : 1
  })
}