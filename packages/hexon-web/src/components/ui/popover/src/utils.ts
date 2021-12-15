import { onBeforeUnmount, ref, Ref, unref, watch } from "vue"
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
      const scrollableNodesSet: Set<Element | Document> = new Set()
      let cursor: Element | Document | null = el
      while (true) {
        cursor = getScrollParent(cursor)
        if (cursor === null) break
        scrollableNodesSet.add(cursor)
      }
      for (const node of scrollableNodesSet) {
        const onScroll = () => {
          if (!elRef.value) return
          rect.value = getRect(elRef.value)
        }
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

/**
 * @see https://github.com/07akioni/vueuc/blob/b3a59ae8f0/src/binder/src/utils.ts
 * @param node
 * @returns
 */
export function getParentNode(node: Node): Node | null {
  // document type
  if (node.nodeType === 9) {
    return null
  }
  return node.parentNode
}

/**
 * @see https://github.com/07akioni/vueuc/blob/b3a59ae8f0/src/binder/src/utils.ts
 * @param node
 * @returns
 */
export function getScrollParent(
  node: Node | null
): HTMLElement | Document | null {
  if (node === null) return null

  const parentNode = getParentNode(node)

  if (parentNode === null) {
    return null
  }

  // Document
  if (parentNode.nodeType === 9) {
    return document
  }

  // Element
  if (parentNode.nodeType === 1) {
    // Firefox want us to check `-x` and `-y` variations as well
    const { overflow, overflowX, overflowY } = getComputedStyle(
      parentNode as HTMLElement
    )
    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      return parentNode as HTMLElement
    }
  }

  return getScrollParent(parentNode)
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
