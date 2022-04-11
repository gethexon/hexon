import esbuild from "esbuild"
import { esbuildPluginNodeExternals } from "esbuild-plugin-node-externals"
import chalk from "chalk"
// FIXME replace with picocolors
function buildServer() {
  return new Promise((resolve) => {
    esbuild
      .build({
        entryPoints: ["./src/server/index.ts"],
        bundle: true,
        platform: "node",
        target: "node12",
        outfile: "dist/index.js",
        plugins: [esbuildPluginNodeExternals({ include: ["execa", "chalk"] })],
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(chalk.gray("[server]"), chalk.green("Build finished."))
        resolve()
      })
  })
}

function buildBin() {
  return new Promise((resolve) => {
    esbuild
      .build({
        entryPoints: ["./src/scripts/index.ts"],
        bundle: true,
        platform: "node",
        target: "node12",
        outfile: "bin/index.js",
        plugins: [esbuildPluginNodeExternals({ include: ["execa", "chalk"] })],
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(chalk.gray("[bin]"), chalk.green("Build finished."))
        resolve()
      })
  })
}
buildServer()
buildBin()
