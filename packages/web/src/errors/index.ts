export function getErrorId(err:any){
  return err?.response?.data?.id
}
export function getErrorMessage(err: any) {
  const data = err?.response?.data
  const id = getErrorId(err)
  switch (id) {
    case "PostOrPageNotFoundError":
      return "没找到，回主页看看？"
    case "HexoInitError":
      return "hexo 初始化中，请稍后再试"
    case "InvalidCreatePathError":
      return "非法的新文章路径"
    default:
      return data.message || err.message
  }
}
