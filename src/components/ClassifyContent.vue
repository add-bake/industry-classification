<template>
  <div class="h-full scroll-box">
    <div class="table-box">
      <a-table
        :columns="columns"
        :loading="loading"
        :rowKey="record => record.id"
        :data-source="tableData"
        :pagination="false"
      />
    </div>
    <import-file :id="id" @success="getContentById" />
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import ImportFile from './ImportFile'
import { content } from '@/api'

const columns = [
  {
    title: '颜色',
    dataIndex: 'variable1'
  }, {
    title: '尺寸',
    dataIndex: 'variable2'
  }, {
    title: '重量',
    dataIndex: 'variable3'
  }
]
export default {
  name: 'ClassifyContent',

  props: {
    id: String
  },

  components: {
    ImportFile
  },

  setup (props, { root }) {
    watch(() => props.id, data => {
      if (data) {
        getContentById()
      } else {
        tableData.value = []
      }
    }, { immediate: true })

    const loading = ref(false)
    const tableData = ref([])
    async function getContentById () {
      loading.value = true
      const { code, msg, data } = await content.getContentById(props.id)
      loading.value = false
      if (code === '200') {
        tableData.value = data
      } else {
        root.$message.warn(msg || '查询失败，请稍后重试')
      }
    }

    return {
      columns,
      loading,
      tableData,
      getContentById
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-left: 1px solid #eee;
}
.table-box {
  width: 80%;
}
</style>
