<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    transition-hide="fade"
    transition-show="fade"
  >
    <q-card class="settings" :class="dark ? 'bg-dark-3' : 'bg-light-3'">
      <q-splitter
        v-model="splitter"
        unit="px"
        class="fit"
        :separator-class="dark ? 'bg-dark-1' : 'bg-light-1'"
      >
        <template v-slot:before>
          <div
            class="fit column"
            :class="dark ? 'bg-dark-1 text-white' : 'bg-light-1 text-grey-9'"
          >
            <q-scroll-area
              class="col"
              :thumb-style="{ width: '6px', borderRadius: '3px' }"
            >
              <q-item class="text-bold title">
                <q-item-section>
                  <q-item-label class="ellipsis">设置</q-item-label>
                </q-item-section>
              </q-item>
              <q-list dense>
                <nav-item
                  icon="person"
                  title="用户"
                  color="green"
                  @on-click="tab = 'user'"
                  :selected="tab === 'user'"
                ></nav-item>
                <nav-item
                  icon="security"
                  title="安全"
                  color="primary"
                  @on-click="tab = 'security'"
                  :selected="tab === 'security'"
                ></nav-item>
                <nav-item
                  icon="style"
                  title="样式"
                  color="yellow-8"
                  @on-click="tab = 'editor'"
                  :selected="tab === 'editor'"
                ></nav-item>
                <nav-item
                  icon="info"
                  title="关于"
                  color="grey"
                  @on-click="tab = 'about'"
                  :selected="tab === 'about'"
                ></nav-item>
                <nav-item
                  icon="help"
                  title="帮助"
                  color="grey"
                  @on-click="tab = 'help'"
                  :selected="tab === 'help'"
                ></nav-item>
              </q-list>
            </q-scroll-area>
            <div class="full-width">
              <q-item clickable @click="logout" class="bg-primary text-grey-3">
                <q-item-section>
                  <q-item-label class="text-bold">登出</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="logout" color="grey-3" />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
            style="background:none"
            class="full-height"
          >
            <q-tab-panel class="full-height" name="user">
              <UserSettings />
            </q-tab-panel>

            <q-tab-panel class="full-height" name="security">
              <div class="text-h4 q-mb-md">安全</div>
            </q-tab-panel>

            <q-tab-panel class="full-height" name="editor">
              <div class="text-h4 q-mb-md">
                样式
                <q-btn color="primary" label="切换" @click="onToggleDark" />
              </div>
            </q-tab-panel>

            <q-tab-panel class="full-height" name="about">
              <div class="text-h4 q-mb-md">关于</div>
            </q-tab-panel>

            <q-tab-panel class="full-height" name="help">
              <div class="text-h4 q-mb-md">帮助</div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </q-dialog>
</template>

<script>
const components = {
  NavItem: () => import("src/components/UI/NavItem"),
  UserSettings: () => import("src/components/UserSettings")
};
export default {
  data() {
    return {
      tab: this.start,
      splitter: 200
    };
  },
  props: {
    start: {
      type: String,
      default: "user"
    }
  },
  components,
  computed: {
    dark() {
      return this.$q.dark.isActive;
    }
  },
  methods: {
    onToggleDark() {
      this.$q.dark.set(!this.$q.dark.isActive);
    },
    async logout() {
      try {
        await this.$store.dispatch("user/logout");
        this.$notify({
          title: "登出成功",
          type: "success",
          duration: 1000
        });
      } catch (err) {
        this.$notify({
          title: "已登出，但出现了一些错误",
          type: "warn",
          duration: 5000
        });
        throw err;
      } finally {
        this.hide();
        this.$router.push("/login");
      }
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
.q-transition--fade-enter-active,
.q-transition--fade-leave-active {
  transition: opacity 0.2s ease-out;
}
.settings {
  width: 960px;
  max-width: calc(100vw - 100px) !important;
  height: 640px;
  max-height: calc(100vh - 100px) !important;
  position: relative;
}

.settings .q-item.item,
.settings .q-item.title {
  margin: 2px 8px 2px 8px;
  padding: 0 2px 0 16px;
  border-radius: 6px;
}
</style>
