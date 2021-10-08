import autoExternal from "rollup-plugin-auto-external";
import clear from "rollup-plugin-clear";
import typescript from "rollup-plugin-typescript2";
import filesize from "rollup-plugin-filesize";
export default {
  input: "./src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
    },
  ],
  plugins: [
    clear({ targets: ["dist"] }),
    autoExternal(),
    typescript(),
    filesize(),
  ],
};
