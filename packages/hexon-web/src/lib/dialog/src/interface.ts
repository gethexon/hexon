export interface IDialogOption {
  type?: DialogType
  title: string
  content?: string
  persistent?: boolean
  actions: IDialogActionOption[]
}

export interface IDialogActionOption {
  label: string
  type: DialogActionType
  /**
   * 热
   * @param item DialogItem
   */
  run?: (item: IDialog) => Promise<void> | void
}

export type DialogType = "success" | "warning" | "error" | "info"
export type DialogActionType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "common"
export interface IDialog {
  id: string
  type: DialogType
  title: string
  content: string
  persistent: boolean
  actions: IDialogAction[]
  close: () => void
}
export interface IDialogAction {
  label: string
  type: DialogActionType
  run?: () => Promise<void> | void
}
