import { inject, InjectionKey, provide } from "@vue/runtime-core";
import { reactive } from "@vue/reactivity";
import { IAccount, IConfig } from "./lib";
import { create, isSignedIn } from ".";
import { RouteLocationNormalized } from "vue-router";

const accountProviderInjectionKey: InjectionKey<IAccount> = Symbol(
  "accountProviderInjection"
);

export const useAccountProvider = (config: IConfig) => {
  const account = create(config);
  provide(accountProviderInjectionKey, reactive(account));
};

export const useAccount = () => {
  return inject(accountProviderInjectionKey);
};

export const useAccountService = () => {
  return inject(accountProviderInjectionKey)?.service;
};

export const useAccountHttp = () => {
  return inject(accountProviderInjectionKey)?.http;
};

export const useAccountAccess = () => {
  return inject(accountProviderInjectionKey)?.http.access;
};

export const useAccountRefresh = () => {
  return inject(accountProviderInjectionKey)?.http.refresh;
};

export const beforeEachGuard =
  (config: { home: string; signin: string }) =>
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (from.path === "/" && to.path === config.home && isSignedIn()) {
      return true;
    }
    if (to.path === config.signin) {
      if (isSignedIn()) {
        return "/";
      } else return true;
    } else {
      if (!isSignedIn()) {
        return config.signin;
      } else return true;
    }
  };
