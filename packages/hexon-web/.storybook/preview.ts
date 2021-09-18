import { Parameters, Decorators, app } from "@storybook/vue3";
import themes from "../src/themes";
import "../src/styles/reset.less";
import { useThemeController } from "../src/lib/theme";

app.use(themes);

export const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators: Decorators = [
  () => ({
    setup() {
      const t = useThemeController();
      const styles = t?.styles;
      return { styles };
    },
    template: '<div :style="styles"><story /></div>',
  }),
];
