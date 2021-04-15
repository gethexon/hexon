<template>
  <q-page :style-fn="styleFn" class="column">
    <q-carousel
      v-model="slide"
      transition-prev="jump-down"
      transition-next="jump-up"
      swipeable
      animated
      control-color="white"
      prev-icon="arrow_left"
      next-icon="arrow_right"
      padding
      arrows
      class="installer text-white col"
    >
      <q-carousel-slide :name="0" class="column no-wrap flex-center">
        <img
          src="~/assets/logo-inverse.svg"
          style="max-width:100px;margin:0 auto;display:block"
        />
        <h2>欢迎使用Hexon</h2>
        <q-btn :ripple="false" class="btn" @click="next1" rounded>
          <q-icon name="campaign" class="q-mr-sm" />
          Let's hexo online!
        </q-btn>
        <div class="q-mt-xl text-center">
          一个在线hexo博客编辑器
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="1" class="column no-wrap flex-center">
        <q-form @submit="checkroot" class="column no-wrap flex-center">
          <h3 class="title">请输入你的hexo博客路径</h3>
          <m-input v-model="root.data" class="min-width"></m-input>
          <div class="q-mt-md text-center">
            你的hexo博客所在路径，与hexo配置文件config.yml相同<br />
            例如<code>~/myhexoblog</code>或者<code>../../myhexoblog</code>
          </div>
          <div
            class="q-mt-md q-pa-sm text-center text-bold error"
            v-if="root.error"
          >
            <q-icon name="warning" class="q-mr-sm" size="xx-large" />
            {{ root.error }}
          </div>
          <q-btn
            :ripple="false"
            class="q-ml-sm q-mt-xl btn"
            icon="check"
            label="检查"
            rounded
            :loading="root.status === 'loading'"
            @click="checkroot"
            :disable="!root.data"
            v-if="root.status !== 'pass'"
          />
        </q-form>
        <q-btn
          :ripple="false"
          class="q-ml-sm q-mt-xl btn"
          icon="campaign"
          label="下一步"
          rounded
          @click="next2"
          :disable="!root.data"
          v-if="root.status === 'pass'"
        />
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="column no-wrap flex-center">
        <q-form @submit="next3" class="column no-wrap flex-center">
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
            label="下一步"
            rounded
            @click="next3"
            :disable="!canSecureNext"
          />
        </q-form>
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="column no-wrap flex-center">
        <q-form @submit="next4" class="column no-wrap flex-center">
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
                  <m-input v-model="password" class="q-my-sm"></m-input>
                </td>
              </tr>
            </tbody>
          </table>
          <q-btn
            :ripple="false"
            class="q-ml-sm q-mt-xl btn"
            icon="campaign"
            label="安装"
            rounded
            @click="next4"
            :disable="!canInstall"
          />
        </q-form>
      </q-carousel-slide>
      <q-carousel-slide :name="4" class="column no-wrap flex-center">
        <h3 class="title" v-if="install.status === 'init'">
          前面搞完再来看吼～
        </h3>
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
      slide: 0,
      root: {
        data: "",
        error: "",
        status: "init"
      },
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
  watch: {
    ["root.data"]() {
      this.root.status = "init";
    }
  },
  methods: {
    styleFn(offset, height) {
      return {
        height: height + "px"
      };
    },
    async checkroot() {
      if (this.root.status === "pass") {
        this.next2();
        return;
      }
      try {
        this.root.status = "loading";
        await api.install.checkroot(this.root.data);
        this.root.status = "pass";
        this.root.error = "";
      } catch (err) {
        this.root.status = "error";
        this.root.error =
          err instanceof NetworkError ? err.message : "unknown error";
        if (!err instanceof NetworkError) throw err;
      }
    },
    next1() {
      this.slide = 1;
    },
    next2() {
      if (this.root.error) return;
      this.slide = 2;
    },
    next3() {
      if (!this.canSecureNext) return;
      this.slide = 3;
    },
    next4() {
      if (!this.canInstall) return;
      this.slide = 4;
      this.doinstall();
    },
    async doinstall() {
      try {
        this.install.status = "installing";
        await api.install.install({
          root: this.root.data,
          secret: this.secret,
          expire: this.expire,
          refresh: this.refresh,
          username: this.username,
          password: sha1(this.password).toString()
        });
        this.install.status = "done";
      } catch (err) {
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
    canSecureNext() {
      return !this.root.error && this.secret && this.expire && this.refresh;
    },
    canInstall() {
      return this.canSecureNext && this.username && this.password;
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
