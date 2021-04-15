<template>
  <q-item clickable>
    <q-item-section>
      <q-item-label caption>
        更新于
      </q-item-label>
      <q-item-label class="row no-wrap">
        {{ updated || "未指定数据" }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn
        size="x-small"
        icon="clear"
        :ripple="false"
        round
        @click.stop="updated = ''"
        v-if="updated"
      ></q-btn>
      <q-btn
        size="x-small"
        icon="today"
        :ripple="false"
        round
        @click.stop="now"
        v-else
        ><q-tooltip>
          指定为现在
        </q-tooltip>
      </q-btn>
    </q-item-section>
    <q-menu>
      <div class="row">
        <q-date
          v-model="updated"
          :mask="format"
          color="primary"
          class="no-shadow"
        />
        <q-time
          v-model="updated"
          :mask="format"
          color="primary"
          class="no-shadow"
          format24h
        />
      </div>
    </q-menu>
  </q-item>
</template>

<script>
import { DATE_FORMAT } from "src/utils/constants";
import { date } from "quasar";
export default {
  name: "UpdatedEditor",
  props: ["post", "getObj", "localUpdate"],
  computed: {
    format() {
      return DATE_FORMAT;
    },
    error() {
      return !!this.updated && isNaN(new Date(this.updated).getTime());
    },
    updated: {
      get() {
        return this.post.updated;
      },
      set(v) {
        let obj = this.getObj();
        obj.updated = v;
        this.localUpdate(obj);
      }
    }
  },
  methods: {
    now() {
      this.updated = date.formatDate(new Date(), DATE_FORMAT);
    }
  }
};
</script>
