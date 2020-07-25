import '@/style/common.less'
import VueCompositionApi from '@vue/composition-api'
import Vue from 'vue'
import App from './App.vue'
import { Layout, Row, Col, Menu, Button, Empty, ConfigProvider, Spin, Message, Modal, Tree, Input, Popconfirm, Upload, Table } from 'ant-design-vue'

Vue.use(VueCompositionApi)
Vue.use(Layout)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Button)
Vue.use(Empty)
Vue.use(ConfigProvider)
Vue.use(Spin)
Vue.use(Modal)
Vue.use(Tree)
Vue.use(Input)
Vue.use(Popconfirm)
Vue.use(Upload)
Vue.use(Table)
Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
