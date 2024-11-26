<script lang="ts" setup>
import { ref, watch } from 'vue'
import BookmarkFavicon from './BookmarkFavicon.vue'
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
  if (data.url) {
    store.updateMarkbookDetail(null)
    window.open(data.url)
  } else {
    store.updateMarkbookDetail(data)
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

const isLink = (data: any) => !data?.children?.length

</script>

<template>
  <section class="input-wrapper">
    <el-input v-model="filterText" placeholder="搜索" />
  </section>

  <el-tree
    ref="treeRef"
    :data="sourceData"
    :props="treeDefaultProps"
    @node-click="handleTreeClick"
    :filter-node-method="filterTreeNode"
    node-key="id"
    class="tree"
    :index="12"
  >
    <template #default="{node, data}">
      <el-link v-if="isLink(data)" class="link-wrapper">
        <el-icon class="el-icon--left">
          <BookmarkFavicon :url="data.url" className="link-icon" />
        </el-icon>
        {{ node.label }}
      </el-link>
      <span class="custom-tree-node" v-else>
        <span>{{ node.label }}</span>
      </span>
    </template>
  </el-tree>
</template>
<style scoped>
.tree {
  margin-top: 10px;
  min-height: calc(100vh - 84px);
  max-height: calc(100vh - 84px);
}
.tree ::v-deep(.el-tree-node__label),
.tree ::v-deep(.el-tree-node__content) {
  height: auto;
  line-height: 26px;
  white-space: break-spaces;
}

.input-wrapper {
  position: sticky;
  top: 0;
  z-index: 33;
  background-color: var(--el-bg-color-overlay);
}

.link-wrapper :deep(.el-link__inner) {
  align-items: flex-start;
}

.link-icon {
  width: 14px;
  height: 14px;
  margin-top: 13px;
}
</style>
