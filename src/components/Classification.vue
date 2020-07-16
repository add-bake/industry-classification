<template>
  <a-row class="h-full">
    <a-button
      class="btn-add"
      type="primary"
      shape="circle"
      icon="plus"
    />
    <a-spin class="custom-spin" :spinning="loading">
      <template v-if="tree.length">
        <a-col class="h-full scroll-box" :span="5">
          <a-menu
            :default-selected-keys="defaultSelected"
            mode="inline"
          >
            <a-menu-item v-for="item in tree" :key="item.classifyId">
              {{item.name}}
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col class="h-full scroll-box" :span="19">
          <div class="classify-list">
            <div>
              <p class="sub-title">测试</p>
              <div>
                <a-button type="link">111</a-button>
                <a-button type="link">111</a-button>
                <a-button type="link">111</a-button>
              </div>
            </div>
          </div>
        </a-col>
      </template>
      <div v-else class="h-full" style="display:flex;align-items:center;justify-content:center">
        <a-empty description="请先添加分类" />
      </div>
    </a-spin>
  </a-row>
</template>

<script>
import { ref } from '@vue/composition-api'
import { service } from '@/request'

export default {
  name: 'Classification',

  setup (props, { root }) {
    const loading = ref(false)
    const tree = ref([])
    const defaultSelected = ref([])
    async function test () {
      if (!loading.value) return ''
      loading.value = true
      const { code, data } = await service.get('/menus/getMenus')
      loading.value = false
      if (code !== '200') return root.$message.warn('分类获取失败，请刷新页面重试')
      if (data.length) {
        tree.value = data
        defaultSelected.value = [data[0].classifyId]
      }
    }
    test()

    return {
      loading,
      tree,
      defaultSelected
    }
  }
}
</script>

<style lang="less" scoped>
.classify-list {
  padding: 15px 0;
}
.sub-title {
  margin: 0 15px;
  color: rgba(0,0,0,.85);
  font-weight: 700;
  font-size: 15px;
  line-height: 1;
}
.btn-add {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 1;
}
.custom-spin {
  height: 100%;
  ::v-deep .ant-spin-container {
    height: 100%;
  }
}
</style>
