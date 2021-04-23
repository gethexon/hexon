import api from "../api";
export default {
  listPosts: async () => {
    const res = await api.hexo.listPosts();
    return res.data;
  },
  listPages: async () => {
    const res = await api.hexo.listPages();
    return res.data;
  },
  listTags: async () => {
    const res = await api.hexo.listTags();
    return res.data;
  },
  listCategories: async () => {
    const res = await api.hexo.listCategories();
    return res.data;
  },
  newPostOrPage: async opt => {
    const res = await api.hexo.newPostOrPage(opt);
    return res.data;
  },
  /**
   * @param {String} id
   * @param {Boolean} page 是否是页面
   * @param {Object} obj 文章完整对象
   */
  updatePostOrPage: async (id, page, obj) => {
    const res = await api.hexo.updatePostOrPage(id, page, obj);
    return res.data;
  },
  /**
   * @param {String} id
   * @param {Boolean} page 是否是页面
   */
  deletePostOrPage: async (id, page) => {
    const res = await api.hexo.deletePostOrPage(id, page);
    return res.data;
  },
  publishPost: async id => {
    const res = await api.hexo.publishPost(id);
    return res.data;
  },
  //#region actions
  generate: async () => {
    await api.hexo.generate();
  },
  deploy: async () => {
    await api.hexo.deploy();
  },
  clean: async () => {
    await api.hexo.clean();
  },
  //#endregion
  //#region git
  gitSync: async () => {
    await api.hexo.gitSync();
  },
  gitSave: async () => {
    await api.hexo.gitSave();
  },
  //#endregion
  search: async query => {
    const res = await api.hexo.search(encodeURIComponent(query));
    return res.data;
  }
};
