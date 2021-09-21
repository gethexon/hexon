import { ActionTree, createStore, MutationTree } from "vuex";
import account from "../account";
import { Category, Page, Post, Tag } from "../types";
import { GET_BLOG_DATA_ACTION } from "./action-types";
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
    ).map((res) => res.data);
    commit(GET_BLOG_DATA, { posts, pages, tags, categories });
  },
};

const store = createStore({ state, mutations, actions });

export default store;
