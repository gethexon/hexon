import { defineStore } from "pinia";
import account from "~/account";
import { list2Tree, TreeNode } from "~/lib/list2tree";
import { Category, Page, Post, Tag } from "~/types";
import { list2object, object2list } from "~/utils";

export interface IState {
  posts: {
    [key: string]: Post;
  };
  pages: {
    [key: string]: Page;
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
        this.posts = list2object(posts as Post[], "slug");
        this.pages = list2object(pages as Page[], "slug");
        this.tags = list2object(tags as Tag[], "slug");
        this.categories = list2object(categories as Category[], "slug");
      } catch (err) {
        return err;
      }
    },
  },
  getters: {
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
