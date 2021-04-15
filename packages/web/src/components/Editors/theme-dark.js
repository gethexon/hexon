export default {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      foreground: "999999",
      token: "comment"
    },
    {
      foreground: "999999",
      token: "string.md"
    },
    {
      // 链接
      foreground: "666666",
      token: "string.link.md"
    },
    {
      // 标题
      foreground: "0e83cd",
      token: "keyword"
    },
    {
      foreground: "0e83cd",
      fontStyle: "bold",
      token: "variable.md"
    }
  ],
  colors: {
    "editor.foreground": "#bdbdbd",
    "editor.background": "#323232",
    "editorCursor.foreground": "#0e83cd",
    "editor.lineHighlightBackground": "#00000005",
    "editor.selectionBackground": "#00000040"
  }
};
