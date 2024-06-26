import esbuild from "esbuild"
import { esbuildPluginNodeExternals } from "esbuild-plugin-node-externals"
import chalk from "chalk"

const INCLUDE_MODULES = [
  "execa",
  "chalk",
  "@winwin/server-reactive-store",
  // 为了让 store 工作，如果不加，store 中的 watch 会失效
  "strip-ansi",
]

// FIXME replace with picocolors
function buildServer() {
  console.log(chalk.gray("[server]"), chalk.green("Building server..."))
  return new Promise((resolve) => {
    esbuild
      .build({
        entryPoints: ["./src/index.ts"],
        bundle: true,
        platform: "node",
        target: "node12",
        outfile: "dist/index.js",
        plugins: [
          esbuildPluginNodeExternals({
            include: INCLUDE_MODULES,
          }),
        ],
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(chalk.gray("[server]"), chalk.green("Build finished."))
        resolve()
      })
  })
}

buildServer()
