import path from "path"
import autoExternal from "rollup-plugin-auto-external"
import clear from "rollup-plugin-clear"
import typescript from "rollup-plugin-typescript2"
import filesize from "rollup-plugin-filesize"
import shebang from "rollup-plugin-preserve-shebang"
import alias from "@rollup/plugin-alias"
const projectRootDir = path.resolve(__dirname)
export default [
  {
    input: "./src/server/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
    ],
    plugins: [
      clear({ targets: ["dist"] }),
      alias({
        entries: [
          { find: "~", replacement: path.resolve(projectRootDir, "src") },
        ],
      }),
      autoExternal(),
      typescript(),
      filesize(),
    ],
  },
  {
    input: "./src/scripts/index.ts",
    output: [
      {
        file: "bin/index.js",
        format: "cjs",
      },
    ],
    plugins: [
      clear({ targets: ["bin"] }),
      alias({
        entries: [
          { find: "~", replacement: path.resolve(projectRootDir, "src") },
        ],
      }),
      autoExternal(),
      typescript(),
      shebang({ shebang: "#!/usr/bin/env node" }),
      filesize(),
    ],
  },
]
