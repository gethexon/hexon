import { ComputedRef } from "vue"
export type INotificationType = "success" | "warning" | "error" | "info"
export type INotificationPosition =
  | "top-left"
  | "top"
  | "top-right"
  | "bottom-left"
  | "bottom"
  | "bottom-right"

export const DEFAULT_NOTIFY_TYPE: INotificationType = "info"
export const DEFAULT_NOTIFICATION_POSITION: INotificationPosition =
  "bottom-right"
export const DEFAULT_NOTIFICATION_DURATION: number = 3000

export interface INotificationItem {
  id: string
  title: string
  type: INotificationType
  desc: string
  duration: number
  permanent: boolean
  close: () => void
  onClick?: () => void
  show: boolean
  token?: NodeJS.Timeout
  createdAt: Date
  actions: {
    label: string
    run: () => void
  }[]
}

export interface INotificationOptions {
  title: string
  type?: INotificationType
  /**
   * extra description
   */
  desc?: string
  duration?: number
  permanent?: boolean
  onClick?: () => void
  actions?: {
    label: string
    run: () => void
  }[]
}

export interface INotification {
  notifications: ComputedRef<{ [key: string]: INotificationItem }>
  /**
   * later-top list
   */
  notificationList: ComputedRef<INotificationItem[]>
  defaults: ComputedRef<INotificationDefaults>
  position: ComputedRef<INotificationPosition>
  /**
   * create a notification
   * @returns
   */
  notify: (options: INotificationOptions) => string
  /**
   * close a notification by id
   */
  close: (id: string) => void
  /**
   * close all notification
   */
  closeAll: () => void
  /**
   * change notification plugin default settings
   */
  setDefaults: (options: Partial<INotificationDefaults>) => void
  /**
   * change notification plugin position
   */
  setPosition: (position: INotificationPosition) => void
}

export interface INotificationDefaults {
  type: INotificationType
  duration: number
}
