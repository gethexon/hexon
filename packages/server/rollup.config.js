import typescript from "rollup-plugin-typescript2";
export default {
  input: "./src/server.js",
  output: [
    {
      file: "dist/server.js",
      format: "cjs",
    },
  ],
  plugins: [typescript()],
};
