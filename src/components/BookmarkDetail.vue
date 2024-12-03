<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import store from '../store/index'
import { Bookmark } from '../types/bookmark'
import BookmarkItem from './BookmarkItem.vue'
import BookmarkActions from './BookmarkActions.vue'
import BookmarkContextMenu from './BookmarkContextMenu.vue'
import NavBreadcrumb from './NavBreadcrumb.vue'
import { useClickBookmarkItem } from '../composables/useClickBookmarkItem'
import { useBookmarkDrag } from '../composables/useBookmarkDrag'

const { handleClickBookmarkItem } = useClickBookmarkItem()

const handleClick = (data: Bookmark) => {
  handleClickBookmarkItem(data)
}

const hasData = computed(() => !!store.markbookDetail?.children?.length)

const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  showContextMenu.value = true
  contextMenuPosition.value = {
    x: e.clientX,
    y: e.clientY
  }
}

// 点击其他地方关闭右键菜单
const handleClickOutside = () => {
  showContextMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const { 
  dragOverIndex,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop
} = useBookmarkDrag()

</script>
<template>
  <el-card shadow="always" v-if="store.markbookDetail" class="container" :class="{ empty: !hasData }" @contextmenu="handleContextMenu">
    <template #header>
      <NavBreadcrumb :nav-path="store.navPath" />
    </template>
    <el-space wrap fill direction="vertical">
      <template v-if="hasData">
        <el-card 
          v-for="(item, index) in store.markbookDetail?.children" 
          :key="item.id" 
          @click="() => handleClick(item)" 
          class="card"
          draggable="true"
          @dragstart="handleDragStart(item)"
          @dragend="handleDragEnd"
          @dragover="(e) => handleDragOver(e, index)"
          @drop="handleDrop(index)"
        >
          <div 
            class="drag-indicator" 
            :class="{ active: dragOverIndex === index }"
          ></div>
          <section class="bookmark-item">
            <BookmarkItem :icon-size="20" :bookmark="item" />
          </section>
          <BookmarkActions :bookmark="item" />
        </el-card>
      </template>
      <el-empty v-else description="空" />
    </el-space>
    
    <BookmarkContextMenu
      v-model:visible="showContextMenu"
      :position="contextMenuPosition"
    />
  </el-card>
</template>
<style lang="css" scoped>
.container {
  margin-top: 10px;
  min-height: calc(100vh - 130px);
}

.empty {
  display: flex;
  flex-direction: column;
}

.container :deep(.el-space--vertical) {
  width: 100%;
}

.icon {
  vertical-align: bottom;
}
.card {
  cursor: pointer;
  position: relative;
  line-height: 20px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.bookmark-item {
  margin-right: 36px;
  display: flex;
}

.drag-indicator {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
  top: -1px;
}

.drag-indicator.active {
  background: #409eff;
}

/* 拖拽时的样式 */
.card[draggable="true"]:active {
  opacity: 0.5;
}

/* 添加列表项移动的过渡效果 */
.el-space--vertical .el-card {
  transition: all 0.3s ease;
}
</style>