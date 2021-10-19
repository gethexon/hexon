import {
  Action,
  ActionTree,
  createStore,
  GetterTree,
  MutationTree,
} from "vuex";
import account from "~/account";
import { list2Tree } from "~/lib/list2tree";
import { Category, Page, Post, Tag } from "~/types";
import { list2object, object2list } from "~/utils";
import { GET_BLOG_DATA_ACTION } from "./action-types";
import { CATEGORIES_LIST, CATEGORIES_TREE } from "./getter-types";
import { GET_BLOG_DATA } from "./mutation-types";

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

const state: IState = {
  posts: {},
  pages: {},
  categories: {},
  tags: {},
};

const mutations: MutationTree<IState> = {
  [GET_BLOG_DATA]: (state, { posts, pages, tags, categories }) => {
    state.posts = posts;
    state.pages = pages;
    state.categories = categories;
    state.tags = tags;
  },
};

const actions: ActionTree<IState, IState> = {
  [GET_BLOG_DATA_ACTION]: async ({ commit }) => {
    const access = account.access;
    const [posts, pages, tags, categories] = (
      await Promise.all([
        access.get("/posts"),
        access.get("/pages"),
        access.get("/tags"),
        access.get("/categories"),
      ])
    )
      .map((res) => res.data)
      .map((item) => list2object(item, "slug"));
    commit(GET_BLOG_DATA, { posts, pages, tags, categories });
  },
};

const getters: GetterTree<IState, IState> = {
  [CATEGORIES_LIST](state) {
    return object2list(state.categories, "slug");
  },
  [CATEGORIES_TREE](state, getters) {
    return list2Tree(getters[CATEGORIES_LIST], (item) => !item.parent, {
      idKey: "_id",
      parentKey: "parent",
      childrenKey: "children",
    });
  },
};

const store = createStore({ state, mutations, actions, getters });

export default store;
