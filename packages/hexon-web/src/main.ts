import { createPinia } from "pinia";
import { createApp } from "vue";
import account from "./account";
import App from "./App.vue";
import router from "./router";
import themes from "./themes";
createApp(App)
  .use(router)
  .use(createPinia())
  .use(themes)
  .use(account)
  .mount("#app");
