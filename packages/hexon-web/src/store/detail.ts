import { defineStore } from "pinia";
import { getArticle } from "~/api";
import { Page, Post } from "~/types";

interface IState {
  type: "post" | "page" | null;
  article: Post | Page | null;
  tmp: Post | Page | null;
  changed: boolean;
  status: "INIT" | "VIEW" | "SAVED" | "CHANGED";
}
export const useDetailStore = defineStore("detail", {
  state: (): IState => ({
    type: null,
    article: null,
    tmp: null,
    changed: false,
    status: "INIT",
  }),
  actions: {
    /**
     * 从服务器获取文章
     * @returns
     */
    async getArticle(options: { source: string; type: "post" | "page" }) {
      let res;
      try {
        res = await getArticle(options.type, options.source);
      } catch (err) {
        // TODO 获取失败之后怎么办
        console.error(err);
        return;
      }
      this.article = options.type === "post" ? (res as Post) : (res as Page);
      this.tmp = null;
      this.changed = false;
      this.status = "VIEW";
    },
    /**
     * 打开已获取的文章
     */
    async openArticle() {
      if (this.status !== "VIEW") return;
      this.tmp = JSON.parse(JSON.stringify(this.article));
      this.changed = false;
      this.status = "SAVED";
    },
    /**
     * 保存当前更改到服务器
     */
    async saveArticle() {
      if (this.status !== "CHANGED") return;
      if (import.meta.env.DEV) {
        // TODO: switch to api
        console.log(`saved`, this.tmp);
        this.article = JSON.parse(JSON.stringify(this.tmp));
        this.tmp = JSON.parse(JSON.stringify(this.tmp));
        this.changed = false;
        this.status = "SAVED";
      }
    },
    /**
     * 更新本地文章
     */
    async updateArticle(updated: Post | Page) {
      if (this.status !== "SAVED") return;
      this.tmp = updated;
      this.changed = true;
      this.status = "CHANGED";
    },
    /**
     * 放弃更改关闭本地文章
     */
    async closeArticle() {
      if (this.status !== "SAVED" && this.status !== "CHANGED") return;
      this.tmp = null;
      this.changed = false;
      this.status = "VIEW";
    },
    /**
     * 清空本地文章
     */
    async clearArticle() {
      this.$reset();
    },
  },
});
