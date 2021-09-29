import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import themes from "../../../src/themes";

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(themes);
  },
};
