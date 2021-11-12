import account from "~/account";

export const getArticle = async (type: "post" | "page", source: string) => {
  return account.access
    .get(`/hexo/${type}/${encodeURIComponent(source)}`)
    .then((res) => res.data);
};

export const getAllData = async () => {
  return Promise.all([
    account.access.get("/hexo/posts"),
    account.access.get("/hexo/pages"),
    account.access.get("/hexo/tags"),
    account.access.get("/hexo/categories"),
  ]).then((list) => list.map((item) => item.data));
};
