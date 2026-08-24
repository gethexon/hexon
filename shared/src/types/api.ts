export interface ISettings {
  ui: {
    editor: {
      fontFamily: string
    }
  }
}

export interface IYamlConfigResponse {
  theme?: string | false
  raw: string
}

export interface IFrontmatterTemplateItem {
  data: string
}

export interface IFrontmatterTemplate {
  items: IFrontmatterTemplateItem[]
}
