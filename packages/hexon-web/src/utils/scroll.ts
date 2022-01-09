import { onBeforeUnmount, Ref, watch } from "vue"
import { getScrollParent } from "./parent"

export function useOnParentScroll(
  elRef: Ref<HTMLElement | null>,
  onScroll: () => void
) {
  const removeEventListenerFnMap: Map<() => void, () => void> = new Map()
  const removeAllEventListener = () => {
    for (const [, fn] of removeEventListenerFnMap) {
      fn()
    }
    removeEventListenerFnMap.clear()
  }
  watch(
    () => elRef.value,
    (el) => {
      removeAllEventListener()
      if (!el) return
      const scrollableNodesSet: Set<Element | Document> = new Set()
      let cursor: Element | Document | null = el
      while (true) {
        cursor = getScrollParent(cursor)
        if (cursor === null) break
        scrollableNodesSet.add(cursor)
      }
      for (const node of scrollableNodesSet) {
        node.addEventListener("scroll", onScroll)
        removeEventListenerFnMap.set(onScroll, () => {
          node.removeEventListener("scroll", onScroll)
        })
      }
    },
    {
      immediate: true,
    }
  )
  onBeforeUnmount(() => {
    removeAllEventListener()
  })
}
