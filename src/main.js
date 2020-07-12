import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import {Tag, Loading, Button, Dialog, Toast} from 'vant'
import 'vant/lib/index.css';
import loading from './directives/loading/directive'
import VueOnTouch from 'v-on-touch'

Vue.use(Loading)
Vue.use(Tag)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Toast)
Vue.use(loading)
Vue.use(VueOnTouch)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
