import { onBeforeUnmount, ref, Ref, unref, watch } from "vue"
import { getScrollParent } from "~/utils/parent"
import { useOnParentScroll } from "~/utils/scroll"
import { IRect } from "./interface"

export function useRect(elRef: Ref<HTMLElement | null>): Ref<IRect> {
  const rect = ref<IRect>({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  })
  useInit(elRef, rect)
  useScroll(elRef, rect)
  useResize(elRef, rect)
  return rect
}

function useInit(elRef: Ref<HTMLElement | null>, rect: Ref<IRect>) {
  watch(
    () => unref(elRef),
    (el) => {
      if (!el) return
      rect.value = getRect(el)
    },
    { immediate: true }
  )
}

function useScroll(elRef: Ref<HTMLElement | null>, rect: Ref<IRect>) {
  useOnParentScroll(elRef, () => {
    if (!elRef.value) return
    rect.value = getRect(elRef.value)
  })
}

function useResize(elRef: Ref<HTMLElement | null>, rect: Ref<IRect>) {
  const removeEventListenerFnMap: Map<() => void, () => void> = new Map()
  const removeAllEventListener = () => {
    for (const [, fn] of removeEventListenerFnMap) {
      fn()
    }
    removeEventListenerFnMap.clear()
  }
  watch(
    () => unref(elRef.value),
    (el) => {
      removeAllEventListener()
      if (!el) return
      const resiableNodesSet: Set<Element | Document> = new Set()
      let cursor: Element | Document | null = el
      while (true) {
        cursor = getScrollParent(cursor)
        if (cursor === null) break
        resiableNodesSet.add(cursor)
      }
      for (const node of [...resiableNodesSet, window]) {
        const onResize = () => {
          if (!elRef.value) return
          rect.value = getRect(elRef.value)
        }
        node.addEventListener("resize", onResize)
        removeEventListenerFnMap.set(onResize, () => {
          node.removeEventListener("resize", onResize)
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

export function getRect(el: HTMLElement): IRect {
  const { left, top, height, width } = el.getBoundingClientRect()
  return {
    left,
    top,
    height,
    width,
  }
}
