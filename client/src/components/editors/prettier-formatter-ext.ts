import { editor, KeyCode, KeyMod } from "monaco-editor"
import { formatMarkdown } from "./prettier-formatter"

export class PrettierFormatterExtension {
  constructor(private readonly id = "prettier.formatter") {}
  activate(editor: editor.IStandaloneCodeEditor) {
    editor.addAction({
      id: this.id,
      label: "Format With Prettier",
      keybindings: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyF],
      contextMenuGroupId: "navigation",
      run(editor) {
        const model = editor.getModel()
        if (!model) return
        const str = editor.getValue()
        editor.executeEdits(this.id, [
          {
            range: model.getFullModelRange(),
            text: formatMarkdown(str),
          },
        ])
      },
    })
  }
}
