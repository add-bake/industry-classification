<template>
  <a-upload
    accept=".xlsx"
    :showUploadList="false"
    :customRequest="handleCustomRequest"
  >
    <a-button
      class="btn-add"
      type="primary"
      shape="circle"
      icon="plus"
      :disabled="!id"
    />
  </a-upload>
</template>

<script>
import { ref } from '@vue/composition-api'
import { service } from '@/request'

export default {
  name: 'ImportFile',

  props: {
    id: String
  },

  setup (props, { root, emit }) {
    const uploading = ref(false)
    async function handleCustomRequest (options) {
      try {
        uploading.value = true
        await service.postForm('/import', {
          file: options.file,
          classifyId: props.id
        })
        emit('success')
      } catch (e) {
        console.error(e)
        root.$message.warn('上传失败')
      } finally {
        uploading.value = false
      }
    }

    return {
      handleCustomRequest
    }
  }
}
</script>

<style lang="less" scoped>
.btn-add {
  position: absolute;
  bottom: 12px;
  right: 26px;
  z-index: 1;
}
</style>
