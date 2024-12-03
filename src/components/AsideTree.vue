<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import BookmarkItem from './BookmarkItem.vue'
import { Bookmark } from '../types/bookmark'
import SearchDialog from './SearchDialog.vue'
import { useClickBookmarkItem } from '../composables/useClickBookmarkItem'
import { Fold } from '@element-plus/icons-vue'
import asideStore from '../store/aside'
import store from '../store'

const { handleClickBookmarkItem } = useClickBookmarkItem()

const treeDefaultProps = {
  children: 'children',
  label: 'title',
}
const handleTreeClick = (data: any) => {
  handleClickBookmarkItem(data)
}

const findNodePath = (tree: Bookmark[], targetId: string, path: Bookmark[] = []): Bookmark[] => {
  for (const node of tree) {
    if (node.id === targetId) {
      return [...path, node]
    }
    if (node.children?.length) {
      const foundPath = findNodePath(node.children, targetId, [...path, node])
      if (foundPath.length) return foundPath
    }
  }
  return []
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

const showSearch = ref(false)

const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    showSearch.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const toggleAside = () => {
  asideStore.toggleCollapse()
}

</script>

<template>
  <el-space class="aside-title-wrapper">
    <el-text class="mx-1" tag="i" size="large">DailyBox</el-text>
    <el-input
      v-model="filterText"
      placeholder="按 Ctrl + K 搜索"
      readonly
      @click="showSearch = true"
      class="input-content"
    />
    <el-icon
      class="collapse-icon"
      :class="{ 'collapsed': asideStore.isCollapsed }"
      size="24"
      @click="toggleAside"
    >
      <Fold />
    </el-icon>
  </el-space>

  <el-tree
    ref="treeRef"
    :data="store.sourceData"
    :props="treeDefaultProps"
    @node-click="handleTreeClick"
    :filter-node-method="filterTreeNode"
    node-key="id"
    class="tree custom-scrollbar"
    :indent="12"
    v-if="!asideStore.isCollapsed"
  >
    <template #default="{data}">
      <BookmarkItem :icon-size="14" :bookmark="data" />
    </template>
  </el-tree>

  <SearchDialog
    v-model:visible="showSearch"
    :source-data="store.sourceData"
    append-to-body
  />
</template>
<style scoped>
.tree {
  margin-top: 10px;
  min-height: calc(100vh - 84px);
  max-height: calc(100vh - 84px);
  overflow-y: auto;
  padding-right: 8px;
  margin-left: -8px;
}

.tree ::v-deep(.el-tree-node__label),
.tree ::v-deep(.el-tree-node__content) {
  height: auto;
  line-height: 26px;
  white-space: break-spaces;
  align-items: baseline;
}

.aside-title-wrapper {
  position: sticky;
  top: 0;
  z-index: 33;
  display: flex;
  align-items: center;
  background-color: var(--el-bg-color);
}
.aside-title-wrapper :deep(.el-space__item:nth-of-type(2)) {
  flex: 1;
}
.input-content {
  background-color: var(--el-bg-color-overlay);
}
.collapse-icon {
  cursor: pointer;
  flex-shrink: 1;
}
.collapse-icon:hover {
  color: var(--el-color-primary);
}
.collapse-icon.collapsed {
  transform: rotate(180deg);
}
</style>