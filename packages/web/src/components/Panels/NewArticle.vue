<template>
  <q-dialog
    ref="dialog"
    :persistent="advance"
    @hide="onDialogHide"
    @show="onShow"
  >
    <q-card class="new-article">
      <q-card-section>
        <div class="title text-h6 q-mb-md text-center">
          新建{{ { page: "页面", draft: "草稿" }[layout] || "文章" }}
        </div>
        <q-form @submit="onAdd">
          <table class="full-width">
            <tbody>
              <tr>
                <td>标题</td>
                <td><m-input v-model="title" ref="title"></m-input></td>
              </tr>
              <template v-if="!advance">
                <tr>
                  <td></td>
                  <td class="row items-center">
                    <q-checkbox
                      class="q-mr-sm"
                      :value="layout === 'page'"
                      @input="v => (layout = v ? 'page' : '')"
                      label="页面"
                    />
                    <q-checkbox
                      class="q-mr-sm"
                      :value="layout === 'draft'"
                      @input="v => (layout = v ? 'draft' : '')"
                      label="草稿"
                    />
                    <q-checkbox v-model="randomSlug" label="随机slug" />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td class="row items-center">
                    <q-space />
                    <q-btn
                      icon="expand_more"
                      label="高级"
                      size="x-small"
                      rounded
                      flat
                      @click="advance = true"
                    />
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td>layout</td>
                  <td><m-input v-model="layout"></m-input></td>
                </tr>
                <tr>
                  <td>path</td>
                  <td><m-input v-model="path"></m-input></td>
                </tr>
                <tr>
                  <td>slug</td>
                  <td>
                    <m-input v-model="slug" :disable="randomSlug"></m-input>
                  </td>
                </tr>
                <tr>
                  <td>随机slug</td>
                  <td class="row items-center">
                    <q-toggle v-model="randomSlug" /><q-space />
                  </td>
                </tr>
                <tr>
                  <td>replace</td>
                  <td class="row items-center">
                    <q-toggle v-model="replace" /><q-space />
                    <q-btn
                      icon="expand_less"
                      label="精简"
                      size="x-small"
                      rounded
                      flat
                      @click="advance = false"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <q-btn style="display:none" />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" @click="onCancelClick" rounded dense />
        <q-btn
          color="primary"
          label="新建"
          @click="onAdd"
          rounded
          dense
          :disable="!title"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { fakeId } from "src/utils/common";
import MInput from "src/components/UI/MInput";
import stringRandom from "string-random";
export default {
  props: {
    // ...your custom props
  },
  components: {
    MInput
  },
  data() {
    return {
      fakeId: fakeId(),
      page: false,
      title: "",
      layout: "",
      path: "",
      slug: "",
      randomSlug: false,
      replace: false,
      advance: false
    };
  },
  watch: {
    randomSlug(v) {
      if (v) this.slug = stringRandom(16);
      else this.slug = "";
    }
  },
  methods: {
    async onAdd() {
      const opt = {};
      ["title", "layout", "path", "slug", "replace"].forEach(key => {
        if (this[key] !== undefined && this[key] !== "") opt[key] = this[key];
      });
      await this.$store.dispatch("hexo/newPostOrPage", {
        fakeId: this.fakeId,
        opt
      });
      const { trueId, page } = this.$store.state.hexo.creating[this.fakeId];
      this.$store.commit("hexo/clearFake", fakeId);
      if (page)
        this.$router.push({
          name: "edit",
          params: { type: "page", id: trueId }
        });
      else
        this.$router.push({
          name: "edit",
          params: { type: "post", id: trueId }
        });
      this.hide();
    },
    onShow() {
      this.$refs.title.focus();
    },
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    }
  }
};
</script>
<style lang="scss">
.new-article {
  background-color: $light-3;
  min-width: 400px;
  table tr td:first-of-type {
    text-align: right;
    padding-right: 20px;
  }
  table tr td {
    padding: 5px 0;
  }
}
.body--dark .new-article {
  background-color: $dark-3;
}
</style>
