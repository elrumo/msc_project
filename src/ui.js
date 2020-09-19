import Vue from 'vue'
import App from './App'
import store from './store/store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  render: h => h(App)
})
