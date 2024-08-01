import { Dayjs } from "dayjs"

export interface IRSaysListData {
  content?: string
  date: Dayjs | null
  link?: string
  video?: { bilibili?: string, player?: string }
  aplayer?: { server: string, id: number }
  image?: string[]
}

export interface IRMusicItem {
  name: string,
  artist: string,
  url: string,
  cover: string,
  lrc: string,
}