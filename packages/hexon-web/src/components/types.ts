export type HNavListActionPayload =
  | { type: "deploy" }
  | { type: "generate" }
  | { type: "clean" }
  | { type: "gitsave" }
  | { type: "gitsync" }
  | { type: "all" }
  | { type: "post" }
  | { type: "page" }
  | { type: "draft" }
  | { type: "category"; slug: string }
  | { type: "tag"; slug: string };
