import { computed, inject, InjectionKey, provide, ref, Ref } from "vue";
import { ITheme } from "./types";

const themeSwitcherProviderInjectionKey: InjectionKey<IUseThemeSwitcher> = Symbol(
  "themeSwitcherProviderInjection"
);

interface IUseThemeSwitcher {
  theme: Ref<ITheme>;
  currentName: Ref<string>;
  setCurrentTheme(name: string): void;
  controller: {
    setTheme(name: string, theme: ITheme): void;
    hasTheme(name: string): boolean;
    deleteTheme(name: string): void;
  };
}

export const useThemeSwitcherProvider = (
  defaultName: string,
  defaultTheme: ITheme
) => {
  const map = ref(new Map<string, ITheme>());
  map.value.set(defaultName, defaultTheme);
  const currentName = ref(defaultName);
  const theme = computed(
    () => map.value.get(currentName.value) || defaultTheme
  );
  const setCurrentTheme = (name: string) => (currentName.value = name);
  const controller = {
    setTheme: (name: string, theme: ITheme) => map.value.set(name, theme),
    hasTheme: (name: string) => map.value.has(name),
    deleteTheme: (name: string) => map.value.delete(name),
  };
  const result = { theme, currentName, setCurrentTheme, controller };
  provide(themeSwitcherProviderInjectionKey, result);
  return result;
};
export const useThemeSwitcher = () => {
  return inject(themeSwitcherProviderInjectionKey);
};
