import { IFrontmatterTemplate, IFrontmatterTemplateItem } from "@hexon/typedef"
import { request } from "./instance"

export async function listFrontmatterTemplate(): Promise<IFrontmatterTemplate> {
  return request.get("/template/frontmatter").then((res) => res.data)
}

export async function setFrontmatterTemplate(
  items: IFrontmatterTemplateItem[]
): Promise<void> {
  return request.post("/template/frontmatter", { items })
}
