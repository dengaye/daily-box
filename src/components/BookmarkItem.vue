<script setup lang="ts">
import { Bookmark } from '../types/bookmark'
import { FolderOpened } from '@element-plus/icons-vue'
import BookmarkFavicon from './BookmarkFavicon.vue'

defineProps<{ bookmark: Bookmark, iconSize: number }>()

const isLink = (item: Bookmark) => {
  return !item?.children?.length
}

</script>
<template>
  <template v-if="isLink(bookmark)">
    <el-icon class="el-icon--left icon" :size="iconSize">
      <BookmarkFavicon :url="bookmark.url" />
    </el-icon>
    <el-link>
      {{ bookmark.title }}
    </el-link>
  </template>
  <template v-else>
    <el-icon :size="iconSize" class="el-icon--left folder-icon">
      <FolderOpened />
    </el-icon>
    <span>{{ bookmark.title }}</span>
  </template>
</template>
<style scoped>
.folder-icon {
  margin-top: -3px;
  vertical-align: bottom;
}
.icon {
  flex-shrink: 0;
}
:deep(.el-link__inner) {
  align-items: baseline;
}
</style>