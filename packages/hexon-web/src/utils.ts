export const forceReloadWindow = () => {
  window.onbeforeunload = () => {};
  window.location.reload();
};

export const DEV = process.env.NODE_ENV !== "production";

export function list2object<
  T extends {
    [key in K]: string;
  },
  K extends string
>(list: T[], key: K): { [key: string]: T } {
  const o: { [key: string]: T } = {};
  list.forEach((item) => (o[item[key]] = item));
  return o;
}

export function object2list<
  T extends {
    [key in K]: string;
  },
  K extends string
>(
  object: {
    [key: string]: T;
  },
  key: K
): T[] {
  return Object.entries(object).map(([key, value]) => value);
}
