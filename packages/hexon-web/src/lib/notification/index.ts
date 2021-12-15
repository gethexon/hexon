import { App, computed, InjectionKey, ref, inject } from "vue"
import { v4 as uuid } from "uuid"
import { noop, object2list } from "~/utils"
import {
  DEFAULT_NOTIFICATION_DURATION,
  DEFAULT_NOTIFICATION_POSITION,
  DEFAULT_NOTIFY_TYPE,
  INotification,
  INotificationDefaults,
  INotificationItem,
  INotificationOptions,
  INotificationPosition,
} from "./types"

class Notification implements INotification {
  private _notifications = ref<{ [key: string]: INotificationItem }>({})
  private _position = ref<INotificationPosition>(DEFAULT_NOTIFICATION_POSITION)
  private _defaults = ref<INotificationDefaults>({
    type: DEFAULT_NOTIFY_TYPE,
    duration: DEFAULT_NOTIFICATION_DURATION,
  })
  get defaults() {
    return computed(() => this._defaults.value)
  }
  get position() {
    return computed(() => this._position.value)
  }
  get notifications() {
    return computed(() => this._notifications.value)
  }
  get notificationList() {
    return computed(() =>
      object2list(this._notifications.value, "id").sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )
    )
  }
  private _createNotificationItem(
    options: INotificationOptions
  ): INotificationItem {
    const {
      title,
      type = this._defaults.value.type,
      desc = "",
      duration = this._defaults.value.duration,
      permanent = false,
      onClick = noop,
    } = options
    const clickable = !!options.onClick
    const id = uuid()
    const show = true
    const createdAt = new Date()
    return {
      id,
      title,
      type,
      desc,
      duration,
      clickable,
      permanent,
      onClick,
      show,
      createdAt,
    }
  }
  public notify(options: INotificationOptions) {
    // create item
    const item = this._createNotificationItem(options)
    // append to store
    this._notifications.value[item.id] = item
    if (!item.permanent) {
      // set timeout
      item.token = setTimeout(() => {
        this._notifications.value[item.id].show = false
        delete this._notifications.value[item.id].token
      }, item.duration)
    }
    return item.id
  }
  public close(id: string) {
    const item = this._notifications.value[id]
    if (item) {
      if (item.token) clearTimeout(item.token)
      this._notifications.value[id].show = false
      delete this._notifications.value[id].token
    }
  }
  public closeAll() {
    this.notificationList.value.forEach((item) => this.close(item.id))
  }
  public setDefaults(options: Partial<INotificationDefaults> = {}) {
    this._defaults.value = { ...this._defaults.value, ...options }
  }
  public setPosition(position: INotificationPosition) {
    this._position.value = position
  }
}

//#region plugin api
const notificationProviderInjectionKey: InjectionKey<Notification> =
  Symbol("notification")

class NotificationPlugin extends Notification {
  public install(app: App) {
    app.provide(notificationProviderInjectionKey, this)
  }
}

export const useNotification = () => {
  const notification = inject(notificationProviderInjectionKey)
  if (!notification) {
    console.warn(`Did you forget to load notification plugin?`)
  }
  return notification!
}

export const createNotification = () => {
  return new NotificationPlugin()
}
//#endregion
export { default as Notification } from "./Notification.vue"
