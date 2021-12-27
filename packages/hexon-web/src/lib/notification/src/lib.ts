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
} from "./interface"

//#region plugin api
const notificationProviderInjectionKey: InjectionKey<Notification> =
  Symbol("notification")

export const useNotification = () => {
  const notification = inject(notificationProviderInjectionKey)
  if (!notification) {
    console.warn(`Did you forget to load notification plugin?`)
  }
  return notification!
}
export interface Notification extends INotification {
  install(app: App): void
}

export function createNotification(): Notification {
  const _notifications = ref<{ [key: string]: INotificationItem }>({})
  const _position = ref<INotificationPosition>(DEFAULT_NOTIFICATION_POSITION)
  const _defaults = ref<INotificationDefaults>({
    type: DEFAULT_NOTIFY_TYPE,
    duration: DEFAULT_NOTIFICATION_DURATION,
  })
  const defaults = computed(() => _defaults.value)
  const position = computed(() => _position.value)
  const notifications = computed(() => _notifications.value)
  const notificationList = computed(() =>
    object2list(_notifications.value, "id").sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    )
  )
  function _createNotificationItem(
    options: INotificationOptions
  ): INotificationItem {
    const {
      title,
      type = _defaults.value.type,
      desc = "",
      duration = _defaults.value.duration,
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
  function notify(options: INotificationOptions) {
    // create item
    const item = _createNotificationItem(options)
    // append to store
    _notifications.value[item.id] = item
    if (!item.permanent) {
      // set timeout
      item.token = setTimeout(() => {
        _notifications.value[item.id].show = false
        delete _notifications.value[item.id].token
      }, item.duration)
    }
    return item.id
  }
  function close(id: string) {
    const item = _notifications.value[id]
    if (item) {
      if (item.token) clearTimeout(item.token)
      _notifications.value[id].show = false
      delete _notifications.value[id].token
    }
  }
  function closeAll() {
    notificationList.value.forEach((item) => close(item.id))
  }
  function setDefaults(options: Partial<INotificationDefaults> = {}) {
    _defaults.value = { ..._defaults.value, ...options }
  }
  function setPosition(position: INotificationPosition) {
    _position.value = position
  }
  return {
    notifications,
    notificationList,
    defaults,
    position,
    notify,
    close,
    closeAll,
    setDefaults,
    setPosition,
    install(app: App) {
      const notification = this
      app.provide(notificationProviderInjectionKey, notification)
    },
  }
}
//#endregion
