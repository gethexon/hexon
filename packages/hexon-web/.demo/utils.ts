export const modules = import.meta.glob("../src/**/demo/*.demo.vue")
export const getNameFromPath = (path: string) => {
  return path
    .split("../src/")[1]
    .split("lib/")
    .join("")
    .split("components/")
    .join("")
    .split("ui/")
    .join("")
    .split("/demo/")
    .join("/")
    .split(".demo.vue")[0]
    .split("/default")
    .join("")
}
