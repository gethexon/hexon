import prettier from "prettier/standalone"
import markdown from "prettier/parser-markdown"
import typescript from "prettier/parser-typescript"
import html from "prettier/parser-html"
import yaml from "prettier/parser-yaml"
import postcss from "prettier/parser-postcss"

export function formatMarkdown(value: string) {
  return prettier.format(value, {
    parser: "markdown",
    plugins: [markdown, typescript, html, yaml, postcss],
    semi: false,
  })
}
