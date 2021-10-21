export type TreeNode<T, C extends string> = T & {
  [key in C]?: TreeNode<T, C>[];
};

export function list2Tree<
  T extends {
    [key in T1]: string;
  } & {
    [key in T2]?: string;
  },
  T1 extends string,
  T2 extends string,
  T3 extends string
>(
  list: T[],
  isParentFn: (item: T) => boolean,
  config: {
    idKey: T1;
    parentKey: T2;
    childrenKey: T3;
  }
): TreeNode<T, T3>[] {
  const { idKey, parentKey, childrenKey } = config;
  const grouped = groupBy(list, parentKey);
  function findChildren(item: T): TreeNode<T, T3> {
    const o = (grouped[item[idKey]] || []).map(findChildren);
    return o.length ? { ...item, [childrenKey]: o } : (item as TreeNode<T, T3>);
  }
  const trees: TreeNode<T, T3>[] = list.filter(isParentFn).map(findChildren);
  return trees;
}

function groupBy<T1 extends { [key in T2]: string }, T2 extends string>(
  list: T1[],
  parentKey: T2
) {
  const o: { [parentKey: string]: T1[] } = {};
  list.map((item) => {
    const pKey = item[parentKey];
    if (!o[pKey]) o[pKey] = [item];
    else o[pKey].push(item);
  });
  return o;
}
