import * as monaco from "monaco-editor"
import { computed, watch } from "vue"
import { useThemeVars } from "@/ui/theme"

function removeHash(str: string) {
  return str.slice(1)
}

export function useMonacoTheme() {
  const vars = useThemeVars()
  const custom = computed(() => {
    return {
      base: (vars.value.isDark
        ? "vs-dark"
        : "vs") as monaco.editor.BuiltinTheme,
      inherit: true,
      rules: [
        {
          foreground: removeHash(vars.value.textColorSecondary),
          token: "comment.content.md",
        },
        {
          foreground: removeHash(vars.value.textColorSecondary),
          token: "comment.md",
        },
        {
          foreground: removeHash(vars.value.textColorPrimary),
          token: "string.md",
        },
        {
          // 链接
          foreground: removeHash(vars.value.colorPrimary),
          token: "string.link.md",
          fontStyle: "blod",
        },
        {
          // 标题
          foreground: removeHash(vars.value.colorPrimary),
          token: "keyword.md",
        },
        {
          // 标题
          foreground: removeHash(vars.value.colorPrimary),
          token: "keyword",
        },
        {
          foreground: removeHash(vars.value.colorPrimary),
          fontStyle: "bold",
          token: "variable.md",
        },
      ],
      colors: {
        "editor.foreground": vars.value.textColorPrimary,
        "editor.background": vars.value.backgroundColorPrimary,
        "editorCursor.foreground": vars.value.colorPrimary,
        "editor.selectionBackground": vars.value.isDark
          ? "#ffffff35"
          : "#00000015",
      },
    }
  })
  const update = () => {
    monaco.editor.defineTheme("hexon", custom.value)
  }
  watch(
    () => custom.value,
    () => {
      update()
    },
    { immediate: true, deep: true }
  )
}
