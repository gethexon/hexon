import { watchEffect } from "vue"

const useEventListener = (
  ele: HTMLElement | Window,
  type: keyof HTMLElementEventMap,
  listener: (evt: Event) => void
) => {
  watchEffect((onInvalidate) => {
    ele.addEventListener(type, listener)
    onInvalidate(() => {
      ele.removeEventListener(type, listener)
    })
  })
}

export default useEventListener
