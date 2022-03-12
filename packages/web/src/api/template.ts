import { IFrontmatterTemplate, IFrontmatterTemplateItem } from "@hexon/typedef"
import account from "~/plugins/account"

export async function listFrontmatterTemplate(): Promise<IFrontmatterTemplate> {
  return account.access.get("/template/frontmatter").then((res) => res.data)
}

export async function setFrontmatterTemplate(
  items: IFrontmatterTemplateItem[]
): Promise<void> {
  return account.access.post("/template/frontmatter", { items })
}
