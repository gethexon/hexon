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
    case "GitSyncScriptError":
      return "git sync 脚本运行失败。请前往服务器后台使用 `yarn script` 修改脚本"
    case "GitSaveScriptError":
      return "git save 脚本运行失败。请前往服务器后台使用 `yarn script` 修改脚本"
    case "HexoCleanScriptError":
      return "hexo clean 脚本运行失败。请前往服务器后台使用 `yarn script` 修改脚本"
    case "HexoDeployScriptError":
      return "hexo deploy 脚本运行失败。请前往服务器后台使用 `yarn script` 修改脚本"
    case "HexoGenerateScriptError":
      return "hexo generate 脚本运行失败。请前往服务器后台使用 `yarn script` 修改脚本"
    default:
      return data.message || err.message
  }
}
