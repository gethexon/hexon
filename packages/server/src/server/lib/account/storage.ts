import { encrypt } from "./utils"

export interface IUserInfo {
  username: string
}
export interface IPassword {
  password: string
}
export interface IUserInfoWithPwd extends IUserInfo, IPassword {}
export interface IAuthInfo {
  secret: string
  expiresIn: string
  refreshableIn: string
}
export interface IInstall {
  installed: boolean
  time: number
}

export interface IStorageService {
  get(key: "authinfo"): IAuthInfo | undefined
  set(key: "authinfo", value: IAuthInfo): void
  get(key: "install"): IInstall | undefined
  set(key: "install", value: IInstall): void
  get(key: "userinfo"): IUserInfoWithPwd | undefined
  set(key: "userinfo", value: IUserInfoWithPwd): void
  get(key: "blocklist"): string[] | undefined
  set(key: "blocklist", value: string[]): void
}

export class StorageService {
  constructor(private storageService: IStorageService) {}
  installed() {
    return this.storageService.get("install")?.installed ?? false
  }
  getAuthInfo(): IAuthInfo {
    return (
      this.storageService.get("authinfo") ?? {
        secret: "secret",
        expiresIn: "1h",
        refreshableIn: "7d",
      }
    )
  }
  setAuthInfo(authInfo: IAuthInfo) {
    this.storageService.set("authinfo", authInfo)
  }
  setInstalled() {
    this.storageService.set("install", {
      installed: true,
      time: new Date().valueOf(),
    })
  }
  changeUsername(username: string) {
    const info = this.getUserInfo()
    info.username = username
    this.setEncryptedUserInfo(info)
  }
  changePassword(password: string) {
    const info = this.getUserInfo()
    info.password = password
    this.setUserInfo(info)
  }
  getUserInfo(): IUserInfoWithPwd {
    return (
      this.storageService.get("userinfo") ?? {
        username: "admin",
        password: "admin",
      }
    )
  }
  /**
   * set unencrypted userinfo
   * @param userInfo
   */
  setUserInfo(userInfo: IUserInfoWithPwd) {
    this.setEncryptedUserInfo({
      username: userInfo.username,
      password: encrypt(userInfo.password),
    })
  }
  setEncryptedUserInfo(userInfo: IUserInfoWithPwd) {
    this.storageService.set("userinfo", userInfo)
  }
  getblocklist(): string[] {
    return this.storageService.get("blocklist") ?? []
  }
  setblocklist(blocklist: string[]) {
    return this.storageService.set("blocklist", blocklist)
  }
  isBlocked(token: string) {
    const blocklist = this.getblocklist()
    return blocklist.includes(token)
  }
  block(tokens: string | string[]) {
    if (!Array.isArray(tokens)) tokens = [tokens]
    const blocklist = this.getblocklist()
    tokens.forEach((token) => blocklist.push(token))
    this.setblocklist(blocklist)
  }
}
