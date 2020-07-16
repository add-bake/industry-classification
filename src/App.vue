<template>
  <a-config-provider :locale="locale">
    <a-row class="h-full">
      <a-col class="h-full" :span="12">
        <classification />
      </a-col>
      <a-col class="h-full content-box" :span="12">
        <a-empty />
      </a-col>
    </a-row>
  </a-config-provider>
</template>

<script>
import Classification from './components/Classification.vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  name: 'App',

  components: {
    Classification
  },

  data () {
    return {
      locale: zhCN
    }
  }
}
</script>

<style lang="less">
.content-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #eee;
  font-size: 24px;
}
</style>
