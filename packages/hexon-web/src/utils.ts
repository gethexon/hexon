export const forceReloadWindow = () => {
  window.onbeforeunload = () => {};
  window.location.reload();
};
export const DEV = process.env.NODE_ENV !== "production";

type ListItem<T1, T2 extends string> = T1 & {
  [key in T2]: string;
};

export function list2object<T1, T2 extends string>(
  list: ListItem<T1, T2>[],
  key: T2
): { [key: string]: ListItem<T1, T2> } {
  const o: { [key: string]: ListItem<T1, T2> } = {};
  list.forEach((item) => (o[item[key]] = item));
  return o;
}
export function object2list<T1, T2 extends string>(
  object: {
    [key: string]: ListItem<T1, T2>;
  },
  key: T2
): ListItem<T1, T2>[] {
  return Object.entries(object).map(([key, value]) => value);
}
