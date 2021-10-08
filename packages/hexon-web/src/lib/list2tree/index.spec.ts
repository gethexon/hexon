import { list2Tree } from ".";

it("should transform list to tree", () => {
  const list = [
    { id: "1" },
    { id: "2" },
    { id: "3", p: "1" },
    { id: "4", p: "1" },
    { id: "5", p: "4" },
  ];
  const correct = [
    {
      id: "1",
      c: [
        { id: "3", p: "1" },
        { id: "4", p: "1", c: [{ id: "5", p: "4" }] },
      ],
    },
    { id: "2" },
  ];
  const res = list2Tree(list, (item) => !item.p, {
    idKey: "id",
    parentKey: "p",
    childrenKey: "c",
  });
  expect(res).toEqual(correct);
});

it("should work if no top node found", () => {
  const list = [
    { id: "3", p: "1" },
    { id: "4", p: "1" },
  ];
  const run = () => {
    list2Tree(list, (item) => !item.p, {
      idKey: "id",
      parentKey: "p",
      childrenKey: "c",
    });
  };
  expect(run).not.toThrow();
});
