import '@/style/common.less'
import VueCompositionApi from '@vue/composition-api'
import Vue from 'vue'
import App from './App.vue'
import { Layout, Row, Col, Menu, Button, Empty, LocaleProvider } from 'ant-design-vue'

Vue.use(VueCompositionApi)
Vue.use(Layout)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Button)
Vue.use(Empty)
Vue.use(LocaleProvider)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
