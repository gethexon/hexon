import * as monaco from "monaco-editor"
export const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    theme: "hexon",
    language: "markdown",
    folding: false,
    readOnly: false,
    roundedSelection: true,
    minimap: { enabled: false },
    occurrencesHighlight: false,
    wordBasedSuggestions: false,
    hideCursorInOverviewRuler: true,
    automaticLayout: true,
    overviewRulerBorder: false,
    renderLineHighlight: "none",
    scrollbar: {
      horizontalScrollbarSize: 10,
      verticalScrollbarSize: 10,
      useShadows: false,
    },
    fontSize: 14,
    lineHeight: 18,
    wordWrap: "on",
    lineNumbers: "off",
    cursorBlinking: "smooth",
    // TODO 支持更换字体
    // fontFamily: "Menlo,Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace",
    fontFamily:
      "PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif",
    contextmenu: true, // 反正也很少用，关掉避免出现概率为30%的误操作bug：打开右键菜单后会立即执行鼠标指针所在的操作。
  }
