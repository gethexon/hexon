import { createNotification } from "./lib"

describe("notification", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("notify", () => {
    const notification = createNotification()
    const id = notification.notify({ title: "test notify" })
    expect(notification.notifications.value[id].title).toBe("test notify")
    expect(notification.notifications.value[id].show).toBe(true)
  })

  it("notify autoclose", () => {
    const notification = createNotification()
    const id = notification.notify({ title: "test notify" })
    jest.advanceTimersByTime(notification.notifications.value[id].duration)
    expect(notification.notifications.value[id].token).toBe(undefined)
    expect(notification.notifications.value[id].show).toBe(false)
  })

  it("close", () => {
    const notification = createNotification()
    const id = notification.notify({ title: "test notify" })
    notification.close(id)
    expect(notification.notifications.value[id].token).toBe(undefined)
    expect(notification.notifications.value[id].show).toBe(false)
  })

  it("close later", async () => {
    const notification = createNotification()
    const id = notification.notify({ title: "test notify" })
    jest.advanceTimersByTime(notification.notifications.value[id].duration / 2)
    notification.close(id)
    expect(notification.notifications.value[id].token).toBe(undefined)
    expect(notification.notifications.value[id].show).toBe(false)
  })

  it("close a closed item", async () => {
    const notification = createNotification()
    const id = notification.notify({ title: "test notify" })
    jest.advanceTimersByTime(
      notification.notifications.value[id].duration + 1000
    )
    notification.close(id)
    expect(notification.notifications.value[id].token).toBe(undefined)
    expect(notification.notifications.value[id].show).toBe(false)
  })

  it("close all", () => {
    const notification = createNotification()
    notification.notify({ title: "test notify1" })
    notification.notify({ title: "test notify2" })
    notification.notify({ title: "test notify3" })
    notification.closeAll()
    jest.advanceTimersByTime(notification.notificationList.value[0].duration)
    expect(
      notification.notificationList.value.filter(
        (item) => item.show || item.token
      )
    ).toEqual([])
  })

  it("sort by createdAt", () => {
    const notification = createNotification()
    const id1 = notification.notify({ title: "test notify1" })
    jest.advanceTimersByTime(10)
    const id2 = notification.notify({ title: "test notify2" })
    jest.advanceTimersByTime(10)
    const id3 = notification.notify({ title: "test notify3" })
    const list = notification.notificationList.value
    expect(list).toEqual([
      notification.notifications.value[id1],
      notification.notifications.value[id2],
      notification.notifications.value[id3],
    ])
  })

  it("set defaults", () => {
    const notification = createNotification()
    notification.setDefaults({ type: "success", duration: 5000 })
    expect(notification.defaults.value.type).toBe("success")
    expect(notification.defaults.value.duration).toBe(5000)
  })
})
