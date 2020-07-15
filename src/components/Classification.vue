<template>
  <a-row class="h-full">
    <a-button
      class="btn-add"
      type="primary"
      shape="circle"
      icon="plus"
    />
    <a-col class="h-full scroll-box" :span="6">
      <a-menu
        :default-selected-keys="[1]"
        mode="inline"
      >
        <a-menu-item v-for="(item, index) in menu" :key="index + 1">
          {{item}}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col class="h-full scroll-box" :span="16">
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
  </a-row>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
export default {
  name: 'Classification',

  setup () {
    const tree = ref([{
      name: '数码办公',
      children: [{
        name: '3C/数码/配件',
        children: [{
          name: '录音笔'
        }, {
          name: 'use电脑周边'
        }]
      }]
    }])
    const menu = computed(() => tree.value.map(x => x.name))

    return {
      tree,
      menu
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
</style>
