export type HNavListActionPayload =
  | { type: "deploy" }
  | { type: "generate" }
  | { type: "preview" }
  | { type: "clean" }
  | { type: "gitsave" }
  | { type: "gitsync" }
  | { type: "all" }
  | { type: "post" }
  | { type: "page" }
  | { type: "draft" }
  | { type: "category"; slug: string }
  | { type: "tag"; slug: string }

export type HViewerToolbarActionPayload =
  | { type: "edit" }
  | { type: "delete" }
  | { type: "publish" }
  | { type: "restore" }
  | { type: "code" }

export type HEditorToolbarActionPayload =
  | { type: "back" }
  | { type: "save" }
  | { type: "delete" }
  | { type: "publish" }
  | { type: "restore" }
  | { type: "code" }

export interface IFormData {
  username: string
  password: string
  password2: string
  secret: string
  expiresIn: string
  refreshableIn: string
}
