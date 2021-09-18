import { App, InjectionKey, inject, computed, ref, ComputedRef } from "vue";

import { DEV } from "../../utils";
export interface ITheme {
  [key: string]: string | ITheme;
}

function serialize(
  obj: ITheme = {},
  prefix: string = "-"
): { [key: string]: string } {
  return Object.keys(obj).reduce((o, key) => {
    const value = obj[key];
    const name = `${prefix}-${key}`;
    if (typeof value === "string") {
      o[name] = value;
      return o;
    } else {
      const res = serialize(value, name);
      return { ...o, ...res };
    }
  }, {} as { [key: string]: string });
}

const themeProviderInjectionKey: InjectionKey<Theme<any>> = Symbol("theme");

type ThemeMap<T> = {
  default: T;
  [key: string]: T;
};

class Theme<T extends ITheme = ITheme> {
  private name = ref("default");
  private map = new Map<string, T>();
  constructor(map: ThemeMap<T>) {
    this.map = new Map(Object.entries(map));
  }
  install(app: App, injectKey?: InjectionKey<Theme<any>> | string) {
    app.provide(injectKey || themeProviderInjectionKey, this);
  }
  changeTheme(name: string) {
    if (!this.map.has(name)) {
      DEV && console.warn(`theme ${name} not found`);
      return;
    }
    this.name.value = name;
  }
  setTheme(name: string, theme: T) {
    this.map.set(name, theme);
  }
  deleteTheme(name: string) {
    if (name === "default") {
      DEV &&
        console.warn(
          `can not delete default theme, try change it by \`setTheme('default', newTheme)\``
        );
      return;
    }
    this.map.delete(name);
  }
  get data() {
    return computed(() => this.map.get(this.name.value));
  }
  get styles() {
    return computed(() => serialize(this.data.value));
  }
  get currentTheme() {
    return computed(() => this.name.value);
  }
  get themeList() {
    return computed(() => [...this.map.keys()]);
  }
}

export function useThemeController<T extends ITheme = ITheme>(
  key: InjectionKey<Theme<T>> | string | null = null
): Theme<T> | undefined {
  return inject(key !== null ? key : themeProviderInjectionKey);
}

export function useTheme<T extends ITheme = ITheme>(
  key: InjectionKey<Theme<T>> | string | null = null
): ComputedRef<T> | undefined {
  return inject(key !== null ? key : themeProviderInjectionKey)?.data;
}

export function createTheme<T extends ITheme = ITheme>(map: ThemeMap<T>) {
  return new Theme(map);
}
