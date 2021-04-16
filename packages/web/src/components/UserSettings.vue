<template>
  <div class="UserSettings q-pa-md">
    <h2 class="text-h4">用户</h2>
    <form class="UserSettings-Form" @submit="setPassword">
      <MInput
        class="UserSettings-Section"
        v-model="oldPassword"
        type="password"
        placeholder="旧密码"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="lock" class="q-mr-sm" />
        </template>
      </MInput>
      <MInput
        class="UserSettings-Section"
        v-model="newPassword"
        type="password"
        placeholder="新密码"
        clearable
        :error="!same"
      >
        <template v-slot:prepend>
          <q-icon name="security" class="q-mr-sm" />
        </template>
      </MInput>
      <MInput
        class="UserSettings-Section"
        v-model="confirmPassword"
        type="password"
        placeholder="重复新密码"
        clearable
        :error="!same"
      >
        <template v-slot:prepend>
          <q-icon name="security" class="q-mr-sm" />
        </template>
      </MInput>
      <q-btn
        color="primary"
        label="更改密码"
        rounded
        size="x-small"
        type="submit"
        style="height:30px"
        :ripple="false"
        :disabled="!canSet"
      />
      <q-btn
        color="primary"
        label="忘记密码"
        flat
        rounded
        size="x-small"
        style="height:30px"
        :ripple="false"
        class="q-ml-md"
      >
        <q-menu content-class="q-pa-sm pop">
          <QMarkdown :src="md.forgetPassword" />
        </q-menu>
      </q-btn>
    </form>
  </div>
</template>
<script>
import { mapState } from "vuex";
import api from "src/api";
import MInput from "./UI/MInput.vue";
import forgetPassword from "src/markdown/settings/forget_password.md";
const components = {
  MInput
};
export default {
  name: "UserSettings",
  components,
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      error: "",
      md: {
        forgetPassword
      }
    };
  },
  computed: {
    ...mapState("user", {
      name: state => state?.info?.data?.name
    }),
    same() {
      return (
        !this.newPassword ||
        !this.confirmPassword ||
        this.newPassword === this.confirmPassword
      );
    },
    message() {
      return !this.same ? "两次输入的密码不一致" : this.error;
    },
    canSet() {
      return this.newPassword && this.confirmPassword && this.same;
    }
  },
  methods: {
    setPassword() {
      api.auth
        .setPassword(this.name, this.oldPassword, this.newPassword)
        .then(() => {
          this.$notify({
            title: "修改成功，请用新密码登陆",
            type: "success",
            duration: 10000
          });
          this.$store.dispatch("user/logout").then(() => {
            this.$router.push("/login");
          });
        })
        .catch(err => {
          this.$notify({
            title: "修改失败",
            text: err,
            type: "error",
            duration: 5000
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.UserSettings {
  min-height: 100%;
}
.UserSettings-Form {
  max-width: 300px;
}
.UserSettings-Section {
  margin-bottom: 20px;
}
</style>
