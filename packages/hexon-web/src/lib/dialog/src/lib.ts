import { App, inject, InjectionKey, provide, Ref, ref } from "vue"
import { v4 as uuid } from "uuid"
import { DialogType, IDialog, IDialogAction, IDialogOption } from "./interface"

const key: InjectionKey<{
  dialogs: Ref<IDialog[]>
  create: (option: IDialogOption) => void
}> = Symbol("hdialog")

class DialogItem implements IDialog {
  public id: string
  public type: DialogType
  public title: string
  public content: string
  public persistent: boolean
  public actions: IDialogAction[]
  public close: () => void
  constructor(option: IDialogOption, dialog: Dialog) {
    this.id = uuid()
    this.type = option.type ?? "info"
    this.title = option.title
    this.content = option.content ?? ""
    this.persistent = option.persistent ?? false
    this.close = () =>
      (dialog.dialogs.value = dialog.dialogs.value.filter(
        (item) => item.id !== this.id
      ))
    this.actions = option.actions.map((action) => {
      const run = async () => {
        await action.run(this)
      }
      return { ...action, run }
    })
  }
}

class Dialog {
  public dialogs = ref<IDialog[]>([])
  public create(option: IDialogOption) {
    const item = new DialogItem(option, this)
    this.dialogs.value.push(item)
  }
}

class DialogPlugin extends Dialog {
  public install(app: App) {
    app.provide(key, this)
  }
}

export function createDialogPlugin() {
  return new DialogPlugin()
}

export function useDialog() {
  return inject(key)!
}
