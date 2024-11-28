<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import store from '../store/index'
import { Bookmark } from '../types/bookmark'
import BookmarkItem from './BookmarkItem.vue'
import BookmarkActions from './BookmarkActions.vue'
import BookmarkContextMenu from './BookmarkContextMenu.vue'

const handleClick = (data: Bookmark) => {
  if (data.children?.length || !data.url) {
    store.updateMarkbookDetail(data)
  } else {
    window.open(data.url)
  }
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
</script>
<template>
  <el-card shadow="always" v-if="store.markbookDetail" class="container" :class="{ empty: !hasData }" @contextmenu="handleContextMenu">
    <el-space wrap>
      <template v-if="hasData">
        <el-card v-for="item in store.markbookDetail?.children" :key="item.id" @click="() => handleClick(item)" class="card">
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
}

.empty {
  display: flex;
  justify-content: center;
}

.container :deep(.el-card__body) {
  display: inline-flex
}
.icon {
  vertical-align: bottom;
}
.card {
  cursor: pointer;
  position: relative;
  line-height: 20px;
}
.bookmark-item {
  margin-right: 36px;
  display: flex;
}
</style>