import Vue from 'vue'
import Notifications from 'vue-notification'
Vue.use(Notifications)
if (process.env.PROD)
  Vue.config.errorHandler = (err, vm, info) => { }
