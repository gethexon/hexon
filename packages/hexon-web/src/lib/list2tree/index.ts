type ListItem<T1 extends string, T2 extends string> = {
  [key in T1]: string;
} & { [key in T2]: string } & { [key: string]: any };
type TreeNode<T1 extends string, T2 extends string, T3 extends string> = {
  [key in T1]: string;
} & { [key in T2]: string } & { [key in T3]?: ListItem<T1, T2>[] } & {
  [key: string]: any;
};
export function list2Tree<
  T1 extends string,
  T2 extends string,
  T3 extends string
>(
  list: ListItem<T1, T2>[],
  config: {
    topId: string;
    idKey: T1;
    parentKey: T2;
    childrenKey: T3;
  }
) {
  const { topId, idKey, parentKey, childrenKey } = config;
  const grouped = groupBy(list, parentKey);
  function findChildren(item: ListItem<T1, T2>): TreeNode<T1, T2, T3> {
    const o = Object.entries(grouped)
      .filter(([parentKey, value]) => parentKey === item[idKey])
      .map(([parentKey, value]) => value)
      .reduce((a, b) => a.concat(b), [])
      .map(findChildren);
    return { ...item, [childrenKey]: o };
  }
  const trees: TreeNode<T1, T2, T3>[] = grouped[topId] || [];
  return trees.map(findChildren);
}

function groupBy<T1 extends string, T2 extends string>(
  list: ListItem<T1, T2>[],
  parentKey: T2
) {
  const o: { [parentKey: string]: ListItem<T1, T2>[] } = {};
  list.map((item) => {
    const pKey = item[parentKey];
    if (!o[pKey]) o[pKey] = [item];
    else o[pKey].push(item);
  });
  return o;
}
