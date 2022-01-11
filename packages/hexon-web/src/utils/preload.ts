export function preLoadMonacoEditor() {
  ;(() => import("@/editors/HMonacoEditor.vue"))()
}
export function preLoadSettingTabs() {
  ;(() => import("~/views/settings/SettingsView.vue"))()
}
export default function preLoadAll() {
  preLoadMonacoEditor()
  preLoadSettingTabs()
}
