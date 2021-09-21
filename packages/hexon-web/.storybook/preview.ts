import { Parameters, Decorators, app } from "@storybook/vue3";
import { useThemeController } from "@winwin/vue-global-theming";
import themes from "../src/themes";
import account from "../src/account";
import "../src/styles/reset.less";

app.use(themes);
app.use(account);

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
