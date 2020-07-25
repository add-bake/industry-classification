<template>
  <a-modal
    v-model="visible"
    title="设置分类"
    width="800px"
    :footer="false"
    :maskClosable="false"
  >
    <a-row>
      <a-col :span="16">
        <div class="tree-box">
          <a-tree
            show-line
            :expandedKeys.sync="expandedKeys"
            :treeData="treeData"
            :replaceFields="{
              title: 'name',
              key: 'id'
            }"
            @select="handleTreeSelect"
          />
        </div>
      </a-col>
      <a-col :span="8" class="h-full edit-box">
        <a-input
          type="text"
          placeholder="请输入"
          v-model.trim="editValue"
          :disabled="current.id === '0'"
        />
        <div class="btn-box">
          <a-button
            type="primary"
            :loading="editLoading"
            :disabled="current.id === '0' || editValue === current.name"
            @click="handleEdit"
          >
            修改
          </a-button>
          <a-popconfirm
            v-if="current.children && current.children.length"
            title="当前节点不为空，确定要删除吗？"
            @confirm="handleDelete"
          >
            <a-button
              type="primary"
              :loading="deleteLoading"
              :disabled="current.id === '0' || !current"
            >
              删除
            </a-button>
          </a-popconfirm>
          <a-button
            v-else
            type="primary"
            :loading="deleteLoading"
            :disabled="current.id === '0' || !current"
            @click="handleDelete"
          >
            删除
          </a-button>
        </div>
        <a-input
          type="text"
          placeholder="请输入"
          v-model.trim="addValue"
          :disabled="current.level === 3"
        />
        <div class="btn-box">
          <a-button
            type="primary"
            :loading="addLoading"
            :disabled="current.level === 3"
            @click="handleAdd"
          >
            添加
          </a-button>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { ref, computed, watch } from '@vue/composition-api'
import { menus } from '@/api'
import { cloneDeep } from 'lodash'

export default {
  name: 'DialogSetClassify',

  props: {
    show: Boolean,
    tree: Array,
    subSelected: String
  },

  setup (props, { root, emit }) {
    const visible = computed({
      get () {
        return props.show
      },
      set (data) {
        emit('update:show', data)
      }
    })
    const treeData = ref([])
    const expandedKeys = ref(['0'])
    watch(() => props.tree, data => {
      treeData.value = [{
        name: '全部',
        id: '0',
        level: 0,
        children: cloneDeep(data)
      }]
    }, { immediate: true })

    const current = ref('')
    function handleTreeSelect (selectedKeys, e) {
      if (e.selected) {
        current.value = cloneDeep(e.node.dataRef)
        editValue.value = e.node.dataRef.name
      } else {
        current.value = ''
        editValue.value = ''
      }
    }

    // 修改
    const editValue = ref('')
    const editLoading = ref(false)
    async function handleEdit () {
      if (!current.value) return root.$message.info('请先选择分类')
      if (!editValue.value) return root.$message.info('请输入')
      editLoading.value = true
      const { code } = await menus.updateMenu({
        id: current.value.id,
        name: editValue.value
      })
      editLoading.value = false
      if (code !== '200') return root.$message.warn('修改失败，请稍后重试')
      root.$message.success('修改成功')
      updateTreeNode({
        pid: current.value.id,
        name: editValue.value
      }, 'update')
    }

    // 添加
    const addValue = ref('')
    const addLoading = ref(false)
    async function handleAdd () {
      if (!current.value) return root.$message.info('请先选择分类')
      if (!addValue.value) return root.$message.info('请输入')
      const { id, level, children } = current.value
      let seqNum = 0
      if (children.length) {
        const arrSeqNum = children.map(x => x.seqNum).sort()
        seqNum = arrSeqNum[arrSeqNum.length - 1] + 1
      }
      const payload = {
        id: getNewId(),
        pid: id,
        name: addValue.value,
        level: level + 1,
        seqNum
      }
      addLoading.value = true
      const { code } = await menus.addMenu(payload)
      addLoading.value = false
      if (code !== '200') return root.$message.warn('添加失败，请稍后重试')
      root.$message.success('添加成功')
      addValue.value = ''
      updateTreeNode(payload)
    }

    function getNewId () {
      let newId = ''
      const { level, children, id } = current.value
      const nowLevel = level + 1
      if (children.length) {
        const arrId = children.map(x => Number(x.id.substr(x.id.length - 4, 4)))
        const before = children[0].id.substring(0, children[0].id.length - 4)
        for (let i = Number(`${nowLevel}000`); i < Number(`${nowLevel}0000`); i++) {
          if (!arrId.some(x => x === i)) {
            newId = `${before}${i}`
            return newId
          }
        }
      } else {
        newId = id === '0' ? `${nowLevel}000` : `${id}${nowLevel}000`
      }
      return newId
    }

    function updateTreeNode (params, type) {
      let hasFinished = false
      const fn = data => {
        if (Array.isArray(data) && !hasFinished) {
          data.forEach(item => {
            if (item.id === params.pid) {
              if (type === 'update') {
                item.name = params.name
              } else if (type === 'delete') {
                const index = item.children.findIndex(x => x.id === params.id)
                item.children.splice(index, 1)
              } else {
                const currentObj = {
                  ...params,
                  children: []
                }
                item.children.push(currentObj)
                current.value.children.push(currentObj)
                if (!expandedKeys.value.some(x => x === item.id)) expandedKeys.value.push(item.id)
              }
              hasFinished = true
              emit('update:tree', treeData.value[0].children)
            } else if (item.children) {
              fn(item.children)
            }
          })
        }
      }
      fn(treeData.value)
    }

    // 删除
    const deleteLoading = ref(false)
    async function handleDelete () {
      if (!current.value) return root.$message.info('请先选择分类')
      deleteLoading.value = true
      const { code } = await menus.deleteMenu(current.value.id)
      deleteLoading.value = false
      if (code !== '200') return root.$message.warn('删除失败，请稍后重试')
      root.$message.success('删除成功')
      updateTreeNode(current.value, 'delete')
      if (props.subSelected === current.value.id || props.subSelected.indexOf(current.value.id) >= 0) emit('clearSubSelected')
      current.value = ''
      editValue.value = ''
    }

    return {
      visible,
      treeData,
      expandedKeys,
      current,
      handleTreeSelect,
      editValue,
      editLoading,
      handleEdit,
      addValue,
      addLoading,
      handleAdd,
      deleteLoading,
      handleDelete
    }
  }
}
</script>

<style lang="less" scoped>
.tree-box {
  max-height: 600px;
  overflow-y: auto;
}
.edit-box {
  padding: 0 12px;
  border-left: 1px solid #eee;
}
.btn-box {
  padding: 12px 0;
  ::v-deep .ant-btn {
    margin-right: 12px;
  }
}
</style>
