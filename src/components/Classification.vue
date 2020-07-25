<template>
  <a-row class="h-full">
    <a-button
      class="btn-add"
      type="primary"
      shape="circle"
      icon="edit"
      @click="dialogShow = true"
    />
    <a-spin class="custom-spin" :spinning="loading">
      <template v-if="tree.length">
        <a-col class="h-full scroll-box" :span="5">
          <a-menu
            v-model="selectedKeys"
            mode="inline"
          >
            <a-menu-item v-for="item in tree" :key="item.id">
              {{item.name}}
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col class="h-full scroll-box" :span="19">
          <div v-if="subTree.length" class="classify-list">
            <div v-for="item in subTree" :key="item.id">
              <p class="sub-title">{{item.name}}</p>
              <div>
                <a-button
                  v-for="subItem in item.children"
                  :key="subItem.id"
                  :class="{active: subItem.id === subSelected}"
                  type="link"
                  @click="handleSubItemClick(subItem.id)"
                >
                  {{subItem.name}}
                </a-button>
              </div>
            </div>
          </div>
          <div v-else class="full-empty">
            <a-empty description="请添加分类" />
          </div>
        </a-col>
      </template>
      <div v-else class="full-empty">
        <a-empty description="请先添加分类" />
      </div>
    </a-spin>
    <dialog-set-classify
      :tree="tree"
      :show.sync="dialogShow"
      :sub-selected="subSelected"
      @update:tree="handleUpdateTree"
      @clearSubSelected="subSelected = ''"
    />
  </a-row>
</template>

<script>
import { ref, computed, watch } from '@vue/composition-api'
import { menus } from '@/api'
import DialogSetClassify from './DialogSetClassify'

export default {
  name: 'Classification',

  components: {
    DialogSetClassify
  },

  setup (props, { root, emit }) {
    const loading = ref(false)
    const tree = ref([])
    const selectedKeys = ref([])
    const subTree = computed(() => tree.value.find(x => x.id === selectedKeys.value[0]).children)
    async function getMenus () {
      loading.value = true
      const { code, data } = await menus.getMenus()
      loading.value = false
      if (code !== '200') return root.$message.warn('分类获取失败，请刷新页面重试')
      if (data.length) {
        tree.value = data
        selectedKeys.value = [data[0].id]
      }
    }
    getMenus()

    const dialogShow = ref(false)

    function handleUpdateTree (newTree) {
      tree.value = newTree
      if (!selectedKeys.value.length && newTree.length) selectedKeys.value.push(newTree[0].id)
    }

    const subSelected = ref('')
    watch(() => subSelected.value, data => {
      emit('change', data)
    }, { immediate: true })
    function handleSubItemClick (id) {
      subSelected.value = id
    }

    return {
      loading,
      tree,
      selectedKeys,
      subTree,
      dialogShow,
      handleUpdateTree,
      subSelected,
      handleSubItemClick
    }
  }
}
</script>

<style lang="less" scoped>
.classify-list {
  padding: 15px 0;
  ::v-deep .active::after {
    content: '';
    position: absolute;
    top: 2px;
    right: 5px;
    bottom: 2px;
    left: 5px;
    z-index: 1;
    border-radius: 3px;
    border: 1px solid #096dd9;
  }
  ::v-deep .ant-btn-link:active,
  ::v-deep .ant-btn-link.active {
    border-color: transparent;
  }
}
.sub-title {
  margin: 6px 15px;
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
.full-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
