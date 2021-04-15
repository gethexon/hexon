<template>
  <q-item>
    <q-item-section>
      <q-item-label caption class="row items-center">
        其他
        <q-icon name="help" class="q-ml-xs cursor-pointer">
          <q-menu content-class="q-pa-sm pop">
            <q-markdown :src="helper.frontmatter" style="max-width:400px">
            </q-markdown>
          </q-menu>
        </q-icon>
        <q-space />
        <q-icon name="refresh" class="cursor-pointer" @click="onReset" />
      </q-item-label>
      <q-item-label class="q-pt-xs">
        <m-textarea
          class="m-codearea"
          v-model="value"
          :placeholder="'key: value'"
          :error="!!error"
          @on-blur="onBlur"
          ref="area"
        ></m-textarea
      ></q-item-label>
      <q-item-label class="text-negative">{{ error }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import yaml from "js-yaml";
import frontmatter from "src/markdown/helper/frontmatter.md";
import MTextarea from "../UI/MTextarea";
import { RESTRICTED_KEYS } from "src/utils/constants";
export default {
  name: "FmEditor",
  props: {
    post: Object,
    getObj: Function,
    localUpdate: Function
  },
  components: {
    MTextarea
  },
  data() {
    return {
      value: "",
      error: "",
      helper: {
        frontmatter
      }
    };
  },
  watch: {
    fm(v) {
      this.value = v;
    }
  },
  computed: {
    fm: {
      get() {
        const res = yaml.dump(this.post.fm);
        return res.toString() === "{}\n" ? "" : res;
      },
      set(v) {
        let obj = this.getObj();
        obj.fm = v;
        this.localUpdate(obj);
      }
    }
  },
  methods: {
    onReset() {
      this.value = this.fm;
      this.error = "";
    },
    onBlur() {
      if (this.value === this.fm) return;
      let res = {};
      try {
        res = yaml.load(this.value);
        this.error = "";
      } catch (err) {
        if (err.reason) {
          this.error = err.name + ": " + err.reason;
          if (process.env.DEV) console.error(e);
        } else {
          this.error = "Unknown error";
          throw err;
        }
      }
      if (!!this.error) return;
      if (typeof res !== "object") {
        this.value = "";
        res = {};
      }
      RESTRICTED_KEYS.map(key => delete res[key]);
      this.fm = res;
    }
  },
  mounted() {
    this.value = this.fm;
  }
};
</script>
