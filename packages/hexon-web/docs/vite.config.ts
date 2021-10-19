import path from "path";
import { defineConfig } from "vite";
const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(projectRootDir, "../src"),
      },
    ],
  },
});
