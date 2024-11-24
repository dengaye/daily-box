<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElTree } from 'element-plus'
import { Bookmark } from '../types/bookmark'

const props = defineProps<{
  sourceData: Bookmark[]
}>()

const treeDefaultProps = {
  children: 'children',
  label: 'title',
}

const handleTreeClick = (data: any) => {
  if (data.url) {
    window.open(data.url)
  }
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

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

  <el-tree-v2
    ref="treeRef"
    :data="sourceData"
    :props="treeDefaultProps"
    @node-click="handleTreeClick"
    :filter-node-method="filterTreeNode"
    key="bookmark-tree"
    class="tree"
  />
</template>
<style scoped>
.tree {
  min-height: 100vh;
  max-height: 100vh;
}
</style>
