import { App, inject, InjectionKey, provide, Ref, ref } from "vue"
import { v4 as uuid } from "uuid"
import { DialogType, IDialog, IDialogAction, IDialogOption } from "./interface"
import { noop } from "~/utils"

const key: InjectionKey<Dialog> = Symbol("hdialog")

class DialogItem implements IDialog {
  public id: string
  public type: DialogType
  public title: string
  public content: string
  public persistent: boolean
  public actions: IDialogAction[]
  public close: () => void
  constructor(option: IDialogOption, dialogs: Ref<IDialog[]>) {
    this.id = uuid()
    this.type = option.type ?? "info"
    this.title = option.title
    this.content = option.content ?? ""
    this.persistent = option.persistent ?? false
    this.close = () =>
      (dialogs.value = dialogs.value.filter((item) => item.id !== this.id))
    this.actions = option.actions.map((action) => {
      const run = async () => {
        this.close()
        const exec = action.run ?? noop
        await exec(this)
      }
      return { ...action, run }
    })
  }
}

export interface Dialog {
  dialogs: Ref<IDialog[]>
  create(option: IDialogOption): void
  install(app: App): void
}

export function createDialogPlugin(): Dialog {
  const dialogs = ref<IDialog[]>([])
  function create(option: IDialogOption) {
    const item = new DialogItem(option, dialogs)
    dialogs.value.push(item)
  }
  return {
    dialogs,
    create,
    install(app: App) {
      const dialog = this
      app.provide(key, dialog)
    },
  }
}

export function useDialog() {
  return inject(key)!
}
