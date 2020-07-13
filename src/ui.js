import Vue from 'vue'
import App from './App'
import Vuent from 'vuent';


Vue.config.productionTip = false

Vue.use(Vuent);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
