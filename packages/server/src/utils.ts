import Debug from "debug";

export const DEV = process.env.NODE_ENV !== "production";

export function createDebug(scope: string) {
  return Debug(`hexon-server:${scope}`);
}

export const noop = () => {};
