<template>
  <q-page :style-fn="styleFn" class="column">
    <q-carousel
      v-model="slide"
      transition-prev="jump-right"
      transition-next="jump-left"
      swipeable
      animated
      control-color="white"
      padding
      class="installer text-white col"
    >
      <q-carousel-slide name="welcome" class="column no-wrap flex-center">
        <img
          src="~/assets/logo-inverse.svg"
          style="max-width:100px;margin:0 auto;display:block"
        />
        <h2>欢迎使用Hexon</h2>
        <q-btn :ripple="false" class="btn" @click="next" rounded>
          <q-icon name="campaign" class="q-mr-sm" />
          Let's hexo online!
        </q-btn>
        <div class="q-mt-xl text-center">
          一个在线hexo博客编辑器
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="user" class="column no-wrap flex-center">
        <q-form @submit="next" class="column no-wrap flex-center">
          <h3 class="title">请设置账户</h3>
          <table class="min-width">
            <tbody>
              <tr class="item">
                <td>用户名</td>
                <td>
                  <m-input v-model="username" class="q-my-sm"></m-input>
                </td>
              </tr>
              <tr class="item">
                <td>密码</td>
                <td>
                  <m-input
                    v-model="password"
                    class="q-my-sm"
                    type="password"
                  ></m-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="q-mt-xl">
            <q-btn
              :ripple="false"
              class="btn"
              label="上一步"
              rounded
              @click="prev"
            />
            <q-btn
              :ripple="false"
              class="q-ml-md btn"
              label="下一步"
              rounded
              type="submit"
              :disable="!userValid"
            />
          </div>
        </q-form>
      </q-carousel-slide>
      <q-carousel-slide name="security" class="column no-wrap flex-center">
        <q-form @submit="next" class="column no-wrap flex-center">
          <h3 class="title">请配置网站安全项</h3>
          <table class="min-width">
            <tbody>
              <tr class="item">
                <td>secret</td>
                <td>
                  <m-input v-model="secret"></m-input>
                </td>
              </tr>
              <tr class="caption q-mb-md">
                <td></td>
                <td>用于通讯加密，默认随机生成</td>
              </tr>
              <tr class="item">
                <td>expire</td>
                <td>
                  <m-input v-model="expire"></m-input>
                </td>
              </tr>
              <tr class="caption q-mb-md">
                <td></td>
                <td>密钥过期时间，默认<code>1h</code></td>
              </tr>
              <tr class="item">
                <td>refresh</td>
                <td>
                  <m-input v-model="refresh"></m-input>
                </td>
              </tr>
              <tr class="caption q-mb-md">
                <td></td>
                <td>刷新密钥过期时间，默认<code>7d</code></td>
              </tr>
            </tbody>
          </table>
          <q-btn
            :ripple="false"
            class="q-ml-sm q-mt-xl btn"
            icon="campaign"
            label="安装"
            rounded
            :disable="!canInstall"
            type="submit"
          />
        </q-form>
      </q-carousel-slide>
      <q-carousel-slide name="install" class="column no-wrap flex-center">
        <template v-if="install.status === 'installing'">
          <q-spinner-gears size="3rem" :thickness="5" />
          <h3 class="title">正在安装</h3>
        </template>
        <template v-if="install.error">
          <h3 class="title">安装失败</h3>
          <div class="q-mt-md q-pa-sm text-center text-bold error">
            <q-icon name="warning" class="q-mr-sm" size="xx-large" />
            {{ install.error }}
          </div>
        </template>
        <template v-if="install.status === 'done'">
          <h3 class="title">完成</h3>
          <q-btn :ripple="false" class="btn" to="/" rounded>
            <q-icon name="campaign" class="q-mr-sm" />
            Let's hexo online!
          </q-btn>
        </template>
      </q-carousel-slide>
    </q-carousel>
    <q-page-sticky position="bottom" expand>
      <span class="text-caption text-white q-pb-sm" style="opacity:0.3"
        >©️ 2019 ~ {{ year }} winwin_2011 with Love</span
      >
    </q-page-sticky>
  </q-page>
</template>

<script>
import api from "src/api";
import srand from "string-random";
import MInput from "../components/UI/MInput";
import sha1 from "crypto-js/sha1";
import { NetworkError } from "src/api/request";
export default {
  name: "Install",
  data() {
    return {
      slide: "welcome",
      secret: srand(16),
      expire: "1h",
      refresh: "7d",
      username: "",
      password: "",
      install: {
        status: "init",
        error: ""
      }
    };
  },
  components: {
    MInput
  },
  methods: {
    styleFn(offset, height) {
      return {
        height: height + "px"
      };
    },
    prev() {
      const { slide } = this;
      if (slide === "user") {
        this.slide = "welcome";
        return;
      }
      if (slide === "security") {
        this.slide = "user";
        return;
      }
      return false;
    },
    next() {
      const { slide } = this;
      if (slide === "welcome") {
        this.slide = "user";
        return;
      }
      if (slide === "user") {
        if (!this.userValid) return;
        this.slide = "security";
        return;
      }
      if (slide === "security") {
        if (!this.securityValid) return;
        this.doinstall();
        return;
      }
      return false;
    },
    nextInstall() {},
    async doinstall() {
      if (!this.canInstall) return;
      this.slide = "install";
      let token;
      try {
        token = setTimeout(() => {
          this.install.status = "installing";
        }, 200);
        await api.install.install({
          secret: this.secret,
          expire: this.expire,
          refresh: this.refresh,
          username: this.username,
          password: sha1(this.password).toString()
        });
        clearTimeout(token);
        token = undefined;
        this.install.status = "done";
      } catch (err) {
        if (process.env.DEV) console.error(err);
        this.install.status = "error";
        this.install.error =
          err instanceof NetworkError ? err.message : "unknown error";
        if (!err instanceof NetworkError) throw err;
      }
    }
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    securityValid() {
      return !!(this.secret && this.expire && this.refresh);
    },
    userValid() {
      return this.username && this.password;
    },
    canInstall() {
      return this.securityValid && this.userValid;
    }
  }
};
</script>
<style lang="scss">
.installer {
  background-color: $primary;
  .btn {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .title {
    font-size: xx-large;
  }
  .error {
    // font-size: large;
    font-family: "Courier New", Courier, monospace;
  }
  .min-width {
    width: 400px;
    max-width: 50vw;
  }
  tr.caption td:nth-of-type(2) {
    padding-left: 10px;
  }
}
</style>
