export const modules = import.meta.glob("../src/**/demo/*.demo.vue")
export const getNameFromPath = (path: string) =>
  path.split("components/")[1].split("/demo/").join("/").split(".demo.vue")[0]
