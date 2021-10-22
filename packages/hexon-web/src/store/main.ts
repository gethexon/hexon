import { defineStore } from "pinia";
import account from "~/account";
import { list2Tree, TreeNode } from "~/lib/list2tree";
import { BriefPage, BriefPost, Category, Tag } from "~/types";
import { list2object, object2list } from "~/utils";

export interface IState {
  posts: {
    [key: string]: BriefPost;
  };
  pages: {
    [key: string]: BriefPage;
  };
  categories: {
    [key: string]: Category;
  };
  tags: {
    [key: string]: Tag;
  };
}

export const useMainStore = defineStore("main", {
  state: (): IState => ({
    posts: {},
    pages: {},
    categories: {},
    tags: {},
  }),
  actions: {
    async getBlogData() {
      const access = account.access;
      try {
        const [posts, pages, tags, categories] = (
          await Promise.all([
            access.get("/posts"),
            access.get("/pages"),
            access.get("/tags"),
            access.get("/categories"),
          ])
        ).map((res) => res.data);
        this.posts = list2object(posts as BriefPost[], "slug");
        this.pages = list2object(pages as BriefPage[], "slug");
        this.tags = list2object(tags as Tag[], "slug");
        this.categories = list2object(categories as Category[], "slug");
      } catch (err) {
        return err;
      }
    },
  },
  getters: {
    articles(state): (BriefPost | BriefPage)[] {
      return object2list<BriefPost | BriefPage, "slug">(
        state.pages,
        "slug"
      ).concat(object2list<BriefPost | BriefPage, "slug">(state.posts, "slug"));
    },
    categoriesTree(): TreeNode<Category, "children">[] {
      return list2Tree(this.categoriesList, (item) => !item.parent, {
        idKey: "_id",
        parentKey: "parent",
        childrenKey: "children",
      });
    },
    categoriesList(): Category[] {
      return object2list(this.categories, "slug");
    },
  },
});
