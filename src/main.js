import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import axios from 'axios'
import axios from '@/api'

import '@/styles/index.css'
import router from '@/router'
import myPlugin from '@/components'

Vue.use(myPlugin)

Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
