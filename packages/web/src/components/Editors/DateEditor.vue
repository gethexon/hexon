<template>
  <q-item clickable>
    <q-item-section>
      <q-item-label caption>
        发布于
      </q-item-label>
      <q-item-label class="row no-wrap">
        {{ date || "未指定数据" }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn
        size="x-small"
        icon="clear"
        :ripple="false"
        round
        @click.stop="date = ''"
        v-if="date"
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
          v-model="date"
          :mask="format"
          color="primary"
          class="no-shadow"
        />
        <q-time
          v-model="date"
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
  name: "DateEditor",
  props: ["post", "getObj", "localUpdate"],
  computed: {
    format() {
      return DATE_FORMAT;
    },
    error() {
      return !!this.date && isNaN(new Date(this.date).getTime());
    },
    date: {
      get() {
        return this.post.date;
      },
      set(v) {
        let obj = this.getObj();
        obj.date = v;
        this.localUpdate(obj);
      }
    }
  },
  methods: {
    now() {
      this.date = date.formatDate(new Date(), DATE_FORMAT);
    }
  }
};
</script>
