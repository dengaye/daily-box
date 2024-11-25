<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Bookmark } from '../types/bookmark'
import store from '../store'

defineProps<{
  sourceData: Bookmark[]
}>()

const treeDefaultProps = {
  children: 'children',
  label: 'title',
}

const handleTreeClick = (data: any) => {
  store.updateMarkbookDetail(data)
  if (data.url) {
    window.open(data.url)
  }
}

const filterText = ref('')
const treeRef = ref()

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})


const filterTreeNode = (value: string, data: any) => {
  if (!value) return true
  return data.title?.includes?.(value)
}
</script>

<template>
  <el-input v-model="filterText" style="width: 240px" placeholder="搜索" />

  <el-tree
    ref="treeRef"
    :data="sourceData"
    :props="treeDefaultProps"
    @node-click="handleTreeClick"
    :filter-node-method="filterTreeNode"
    node-key="id"
    class="tree"
  />
</template>
<style scoped>
.tree {
  margin-top: 10px;
  min-height: calc(100vh - 84px);
  max-height: calc(100vh - 84px);
}
.tree ::v-deep .el-tree-node__label,
.tree ::v-deep .el-tree-node__content {
  height: auto;
  line-height: 26px;
  white-space: break-spaces;
}
</style>
