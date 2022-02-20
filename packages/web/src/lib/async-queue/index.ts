export class AsyncQueue {
  private fns: (() => Promise<void> | void)[] = []
  /**
   * @param time 暂停时间（秒）
   * @returns
   */
  sleep(time = 0) {
    this.fns.push(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, time * 1000)
      })
    })
    return this
  }
  exec(fn: () => Promise<void> | void) {
    this.fns.push(fn)
    return this
  }
  /**
   * @param interval 间隔时间（秒）
   * @param count 重复次数
   */
  interval(fn: () => Promise<void> | void, interval: number, count: number) {
    this.exec(fn)
    for (let i = 0; i < count - 1; i++) {
      this.sleep(interval)
      this.exec(fn)
    }
    return this
  }
  async start() {
    for (const fn of this.fns) {
      await fn()
    }
  }
}
