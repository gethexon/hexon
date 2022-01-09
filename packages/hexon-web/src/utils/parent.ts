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
