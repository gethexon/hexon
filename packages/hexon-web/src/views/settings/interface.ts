import type { Component } from "vue"

export type SettingsTab = "user" | "security" | "style" | "about" | "help"
export interface ISettingsTab {
  key: string
  title: string
  comp: Component
}
