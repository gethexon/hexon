<template>
  <div ref="monaco-editor" class="overflow-hidden"></div>
</template>

<script>
//#region import
// import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands.js'
// import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js'
// import 'monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js'
// import 'monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js'

// import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js'
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js'
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js'
import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
// import 'monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js'
// import 'monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector.js'
// import 'monaco-editor/esm/vs/editor/contrib/comment/comment.js'
import "monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js";
// import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js'
import "monaco-editor/esm/vs/editor/contrib/dnd/dnd.js";
// import 'monaco-editor/esm/vs/editor/contrib/folding/folding.js'
// import 'monaco-editor/esm/vs/editor/contrib/format/formatActions.js'
// import 'monaco-editor/esm/vs/editor/contrib/gotoError/gotoError.js'
import "monaco-editor/esm/vs/editor/contrib/hover/hover.js";
import "monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace.js";
import "monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js";
import "monaco-editor/esm/vs/editor/contrib/links/links.js";
// import 'monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js'
// import 'monaco-editor/esm/vs/editor/contrib/rename/rename.js'
// import 'monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js'
// import 'monaco-editor/esm/vs/editor/contrib/snippet/snippetController2.js'
// import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js'
// import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode.js'
// import 'monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js'

// import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js'
// import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js'
// import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js'
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOutline.js'
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/gotoLine.js'
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickCommand.js'
// import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js'

import "monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js";
import "monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js";
// import 'monaco-editor/esm/vs/base/browser/ui/codiconLabel/codiconLabel.js'
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/monaco.contribution";
// import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution'
//#endregion
import * as MonacoMarkdown from "monaco-markdown";
import myTheme from "./theme";
import myThemeDark from "./theme-dark";

function getThemeName(isDarkActive) {
  return isDarkActive ? "myTheme" : "myThemeDark";
}

export default {
  name: "MonacoEditor",
  props: {
    value: String
  },
  data() {
    return {
      rect: {
        width: 0,
        height: 0
      }
    };
  },
  watch: {
    value(v) {
      if (this.editor.getValue() !== v) {
        this.editor.setValue(v);
      }
    },
    dark(v) {
      monaco.editor.setTheme(getThemeName(v));
    }
  },
  methods: {
    layout() {
      this.editor.layout();
    }
  },
  computed: {
    dark() {
      return this.$q.dark.isActive;
    },
    style() {
      return `width:${this.rect.width}px;height:${this.rect.height}px`;
    }
  },
  mounted() {
    const dom = this.$refs["monaco-editor"];

    //#region config
    // TODO: 优化主题
    // TODO: 添加暗色主题，支持实时切换
    // TODO 监控父容器大小变化，实时调整大小
    monaco.editor.defineTheme(getThemeName(false), myTheme);
    monaco.editor.defineTheme(getThemeName(true), myThemeDark);

    const editorOptions = {
      value: this.value,
      language: "markdown",
      theme: getThemeName(this.$q.dark.isActive),
      folding: false,
      readOnly: false,
      roundedSelection: true,
      renderIndentGuides: false,
      minimap: { enabled: false },
      occurrencesHighlight: false,
      wordBasedSuggestions: false,
      highlightActiveIndentGuide: false,
      hideCursorInOverviewRuler: true,
      automaticLayout: true,
      overviewRulerBorder: false,
      renderLineHighlight: "none",
      scrollbar: {
        vertical: "hidden",
        horizontal: "hidden",
        verticalScrollbarSize: 6,
        useShadows: false
      },
      fontSize: 14,
      lineHeight: 18,
      wordWrap: "on",
      lineNumbers: "off",
      cursorBlinking: "smooth",
      // TODO: 支持更换字体
      // fontFamily: "Menlo,Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace",
      fontFamily:
        "PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif",
      contextmenu: false // 反正也很少用，关掉避免出现概率为30%的误操作bug：打开右键菜单后会立即执行鼠标指针所在的操作。
    };
    //#endregion
    this.editor = monaco.editor.create(dom, editorOptions);
    this.editor.onDidChangeModelContent(() => {
      const value = this.editor.getValue();
      if (this.value !== value) {
        this.$emit("input", value);
      }
    });
    const extension = new MonacoMarkdown.MonacoMarkdownExtension();
    extension.activate(this.editor);
  },
  beforeDestroy() {
    this.editor.dispose();
  }
};
</script>
<style lang="scss">
.vs .monaco-scrollable-element > .scrollbar > .slider {
  border-radius: 3px;
}
</style>
