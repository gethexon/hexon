import { Dayjs } from "dayjs"
import { IArticleIdentifier } from "~/interface"

export interface IShowMenuPaylod {
  article: IHArticleListData
  e: MouseEvent
}

export interface IHArticleListData {
  type: "post" | "page"
  isDraft: boolean
  title: string
  brief: string
  tags: string[]
  categories: string[]
  date: Dayjs | null
  updated: Dayjs | null
  source: string
}

export type IHarticleMenuActionPayload =
  | {
      type: "edit"
      id: IArticleIdentifier
    }
  | {
      type: "delete"
      id: IArticleIdentifier
    }
  | {
      type: "publish"
      source: string
    }

export type IHArticleMenuActionType = IHarticleMenuActionPayload["type"]
