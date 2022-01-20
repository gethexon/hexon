import { Ref, watchEffect } from "vue"

const useResizeObserver = (
  ele: Ref<HTMLElement | undefined>,
  cb: (entry: ResizeObserverEntry) => void
) => {
  watchEffect((onInvalidate) => {
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        cb(entry)
      }
    })
    if (ele.value) {
      ro.observe(ele.value)
    }
    onInvalidate(() => {
      ro.disconnect()
    })
  })
}

export default useResizeObserver
