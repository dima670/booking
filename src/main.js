import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify';
import {routes} from './routes'
import axios from 'axios';


Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.prototype.$http = axios;

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
