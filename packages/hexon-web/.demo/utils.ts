export const modules = import.meta.glob("../src/**/demo/*.demo.vue")
export const getNameFromPath = (path: string) => {
  return path
    .split("../src/")[1]
    .split("/demo/")
    .join("/")
    .split(".demo.vue")[0]
}
