import { IFrontmatterTemplate, IFrontmatterTemplateItem } from "@server/server/types/api"
import { request } from "./instance"

export async function listFrontmatterTemplate(): Promise<IFrontmatterTemplate> {
  return request.get("/template/frontmatter").then((res) => res.data)
}

export async function setFrontmatterTemplate(
  items: IFrontmatterTemplateItem[]
): Promise<void> {
  return request.post("/template/frontmatter", { items })
}
