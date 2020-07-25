<template>
  <a-config-provider :locale="locale">
    <a-row class="h-full">
      <a-col class="h-full" :span="12">
        <classification @change="classifyId = arguments[0]" />
      </a-col>
      <a-col class="h-full" :span="12">
        <classify-content :id="classifyId" />
      </a-col>
    </a-row>
  </a-config-provider>
</template>

<script>
import Classification from './components/Classification.vue'
import ClassifyContent from './components/ClassifyContent.vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { ref } from '@vue/composition-api'

export default {
  name: 'App',

  components: {
    Classification,
    ClassifyContent
  },

  setup () {
    const classifyId = ref('')

    return {
      locale: zhCN,
      classifyId
    }
  }
}
</script>

<style lang="less">

</style>
