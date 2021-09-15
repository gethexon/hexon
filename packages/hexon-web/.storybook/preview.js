import { ThemeProvider } from "../src/lib/theme";
import { defaultTheme } from "../src/constants";
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const theme = defaultTheme;

export const decorators = [
  (story) => ({
    components: { story, ThemeProvider },
    data: () => ({ theme }),
    template: '<theme-provider :theme="theme"><story/> </theme-provider>',
  }),
];
