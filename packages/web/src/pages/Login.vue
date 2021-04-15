<template>
  <q-page :style-fn="styleFn" class="bg-dark-2 column overflow-auto no-wrap">
    <div class="flex flex-center" style="flex:1 0 0">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
        style="min-width:250px"
      >
        <div>
          <img
            src="~/assets/logo.svg"
            style="max-width:100px;margin:0 auto;display:block"
          />
        </div>
        <p class="text-grey-6 text-center text-no-wrap" style="font-size:large">
          登录到 Hexon
        </p>
        <m-input
          v-model="name"
          type="text"
          class="col"
          placeholder="用户名"
          :error="error"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="person" class="q-mr-sm" />
          </template>
        </m-input>
        <m-input
          v-model="pass"
          type="password"
          class="col"
          placeholder="密码"
          :error="error"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="security" class="q-mr-sm" />
          </template>
        </m-input>
        <div class="row">
          <q-btn
            color="primary"
            label="登录"
            rounded
            size="x-small"
            class="col"
            type="submit"
            style="height:30px"
            :ripple="false"
          />
        </div>
        <div class="row">
          <q-btn
            color="grey-6"
            label="忘记密码"
            flat
            rounded
            size="x-small"
            class="col q-mr-sm"
            style="height:30px"
            :ripple="false"
          />
          <q-btn
            color="grey-6"
            label="帮助"
            flat
            rounded
            size="x-small"
            class="col"
            style="height:30px"
            :ripple="false"
          />
        </div>
      </q-form>
    </div>
    <div
      class="text-center text-grey-6 text-h6 text-no-wrap"
      style="font-size:x-small"
    >
      ©️ 2019 ~ {{ year }} winwin_2011
    </div>
  </q-page>
</template>

<script>
import MInput from "../components/UI/MInput";
import { mapState } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      name: "",
      pass: ""
    };
  },
  components: {
    MInput
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    ...mapState("user", {
      error: state => state.err.indexOf("wrong") >= 0
      // TODO: 处理详细的错误代码
    })
  },
  methods: {
    styleFn(offset, height) {
      return {
        height: height + "px"
      };
    },
    onReset() {},
    async onSubmit() {
      try {
        await this.$store.dispatch("user/login", {
          name: this.name,
          pass: this.pass
        });
        if (this.$store.state.user.alive) {
          this.$notify({
            title: "登录成功",
            type: "success",
            duration: 1000
          });
          this.$router.push("/");
        } else throw 1;
      } catch (err) {
        this.$notify({
          title: "登录失败",
          text: this.$store.state.user.err,
          type: "error",
          duration: 5000
        });
        if (err !== 1) throw err;
      }
    }
  }
};
</script>
