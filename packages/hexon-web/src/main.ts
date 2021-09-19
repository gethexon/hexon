import { createApp } from "vue";
import account from "./account";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import themes from "./themes";

createApp(App).use(router).use(store).use(themes).use(account).mount("#app");
