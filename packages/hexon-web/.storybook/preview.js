import { ThemeProvider } from "../src/lib/theme";
import { blueTheme } from "../src/constants";
import "../src/reset.less";
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const theme = blueTheme;

export const decorators = [
  (story) => ({
    components: { story, ThemeProvider },
    data: () => ({ theme }),
    template: '<theme-provider :theme="theme"><story/> </theme-provider>',
  }),
];
