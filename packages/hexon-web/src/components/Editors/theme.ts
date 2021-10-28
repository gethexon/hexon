import { useTheme } from "@winwin/vue-global-theming";
import { computed, watch } from "vue-demi";
import { HTheme } from "~/themes";
import * as monaco from "monaco-editor";

function removeHash(str: string) {
  return str.slice(1);
}

export function useMonacoTheme() {
  const theme = useTheme<HTheme>()!;
  const custom = computed(() => {
    return {
      base: "vs" as monaco.editor.BuiltinTheme,
      inherit: true,
      rules: [
        {
          foreground: removeHash(theme.value.color.foreground.sub),
          token: "comment.content.md",
        },
        {
          foreground: removeHash(theme.value.color.foreground.main),
          token: "string.md",
        },
        {
          // 链接
          foreground: removeHash(theme.value.color.primary.n),
          token: "string.link.md",
          fontStyle: "blod",
        },
        {
          // 标题
          foreground: removeHash(theme.value.color.primary.n),
          token: "keyword.md",
        },
        {
          // 标题
          foreground: removeHash(theme.value.color.primary.n),
          token: "keyword",
        },
        {
          foreground: removeHash(theme.value.color.primary.n),
          fontStyle: "bold",
          token: "variable.md",
        },
      ],
      colors: {
        "editor.foreground": theme.value.color.foreground.main,
        "editor.background": theme.value.color.background.base1,
        "editorCursor.foreground": theme.value.color.primary.n,
        "editor.lineHighlightBackground": theme.value.color.primary.a1,
        "editor.selectionBackground": theme.value.color.background.hover,
      },
    };
  });
  const update = () => {
    monaco.editor.defineTheme("hexon", custom.value);
  };
  watch(
    () => custom,
    () => {
      update();
    },
    { immediate: true }
  );
}
