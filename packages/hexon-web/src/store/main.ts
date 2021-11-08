import { defineStore } from "pinia";
import { getAllData } from "~/api";
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
      try {
        const [posts, pages, tags, categories] = await getAllData();
        this.posts = list2object(posts as BriefPost[], "source");
        this.pages = list2object(pages as BriefPage[], "source");
        this.tags = list2object(tags as Tag[], "slug");
        this.categories = list2object(categories as Category[], "slug");
      } catch (err) {
        return err;
      }
    },
  },
  getters: {
    articles(state): (BriefPost | BriefPage)[] {
      return object2list<BriefPost | BriefPage, "source">(
        state.pages,
        "source"
      ).concat(
        object2list<BriefPost | BriefPage, "source">(state.posts, "source")
      );
    },
    allPostsList(state): BriefPost[] {
      return object2list(state.posts, "source");
    },
    publishedPostsList(state): BriefPost[] {
      return this.allPostsList.filter((post) => post.published);
    },
    draftsList(state): BriefPost[] {
      return this.allPostsList.filter((post) => !post.published);
    },
    pagesList(state): BriefPage[] {
      return object2list(state.pages, "source");
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
