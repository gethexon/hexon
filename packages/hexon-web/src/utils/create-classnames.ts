import { computed } from "vue"

/**
 * @param prefix prefix
 * @param fn config function
 * @returns
 */
export function createClassNames(
  prefix: string,
  fn: (
    add: (name: string) => void,
    m: (...names: string[]) => string
  ) => void = () => {}
) {
  const classNames = computed(() => {
    const classNames: any[] = [prefix]
    /**
     * add a classname
     * @param name classname
     */
    function add(name: string) {
      classNames.push(name)
    }
    /**
     * create a classname with a modification name `prefix-mod1-mod2-*-modn`
     * @param names modification name
     * @returns
     */
    function m(...names: string[]) {
      return `${prefix}-${names.join("-")}`
    }
    fn(add, m)
    return classNames
  })
  return { classNames, prefix }
}
