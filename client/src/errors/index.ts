export function getErrorId(err:any){
  return err?.response?.data?.id
}
export function getErrorMessage(err: any) {
  const data = err?.response?.data
  const id = getErrorId(err)
  switch (id) {
    case "PostOrPageNotFoundError":
      return "沒找到，回首頁看看？"
    case "HexoInitError":
      return "hexo 初始化中，請稍後再試"
    case "InvalidCreatePathError":
      return "非法的新文章路徑"
    case "GitSyncScriptError":
      return "git sync 指令碼執行失敗。請前往伺服器後臺使用 `pnpm run script` 修改指令碼"
    case "GitSaveScriptError":
      return "git save 指令碼執行失敗。請前往伺服器後臺使用 `pnpm run script` 修改指令碼"
    case "HexoCleanScriptError":
      return "hexo clean 指令碼執行失敗。請前往伺服器後臺使用 `pnpm run script` 修改指令碼"
    case "HexoDeployScriptError":
      return "hexo deploy 指令碼執行失敗。請前往伺服器後臺使用 `pnpm run script` 修改指令碼"
    case "HexoGenerateScriptError":
      return "hexo generate 指令碼執行失敗。請前往伺服器後臺使用 `pnpm run script` 修改指令碼"
    default:
      return data.message || err.message
  }
}
