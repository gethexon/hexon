import { monaco } from "./custom-monaco"

export class MarkdownImageExtension {
  private static _disposiable: monaco.IDisposable | null
  public activate() {
    MarkdownImageExtension._disposiable?.dispose()
    MarkdownImageExtension._disposiable =
      monaco.languages.registerHoverProvider("markdown", {
        provideHover(model, position) {
          const res = model
            .findMatches(
              `!\\[(.*?)\\]\\((.*?)\\)`,
              false,
              true,
              false,
              null,
              true
            )
            .filter((fm) => fm.range.containsPosition(position))[0]
          const value = res?.matches?.[0]
          const image = res?.matches?.[2]
          if (!value || !image) return null

          return {
            range: res.range,
            contents: [
              {
                value: `[${value}](${image})`,
              },
            ],
          }
        },
      })
  }
}
