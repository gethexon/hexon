export const forceReloadWindow = () => {
  window.onbeforeunload = () => {}
  window.location.reload()
}

export const DEV = process.env.NODE_ENV !== "production"

export function list2object<
  T extends {
    [key in K]: string
  },
  K extends string
>(list: T[], key: K): { [key: string]: T } {
  const o: { [key: string]: T } = {}
  list.forEach((item) => (o[item[key]] = item))
  return o
}

/**
 * @param object 需要转换的对象
 * @param key 用来当作 key 的键
 * @returns
 */
export function object2list<
  T extends {
    [key in K]: string
  },
  K extends string
>(
  object: {
    [key: string]: T
  },
  key: K
): T[] {
  return Object.entries(object).map(([key, value]) => value)
}

export function isMultiCategories(
  categories: string[] | (string | string[])[]
) {
  return !!categories.filter((category) => Array.isArray(category)).length
}

export function categories2Array2d(
  categories: string[] | (string | string[])[]
): string[][] {
  if (JSON.stringify(categories) === JSON.stringify([])) return []
  if (!isMultiCategories(categories)) return [categories as string[]]
  else
    return categories.map((category) =>
      Array.isArray(category) ? category : [category]
    )
}

export const noop = () => {}
