import {
  computed,
  defineComponent,
  h,
  inject,
  InjectionKey,
  PropType,
  provide,
  ref,
  Ref,
  renderSlot,
} from "vue";
import { ITheme } from "./types";

const serialize = (
  obj: ITheme,
  prefix: string = "-"
): { [key: string]: string } => {
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
};

const themeProviderInjectionKey: InjectionKey<{ theme: Ref<ITheme> }> = Symbol(
  "themeProviderInjection"
);

const themeProviderProps = {
  theme: {
    type: Object as PropType<ITheme>,
    default: {},
  },
  tag: {
    type: String,
    default: "div",
  },
};

// 1. 提供主题
export const ThemeProvider = defineComponent({
  name: "ThemeProvider",
  props: themeProviderProps,
  setup(props) {
    const style = computed(() => serialize(props.theme));
    const theme = computed(() => props.theme);
    provide(themeProviderInjectionKey, { theme });
    return { style };
  },
  render() {
    return h(
      this.tag,
      {
        style: this.style,
      },
      renderSlot(this.$slots, "default")
    );
  },
});

// 2. 使用主题
export function useTheme() {
  return inject(themeProviderInjectionKey, { theme: ref({}) });
}
