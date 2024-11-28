<script setup lang="ts">
import { computed } from 'vue'
import { Bookmark } from '../types/bookmark'
import { Folder } from '@element-plus/icons-vue'
import BookmarkFavicon from './BookmarkFavicon.vue'

const { bookmark } = defineProps<{ bookmark: Bookmark, iconSize: number }>()

const isLink = computed(() => !bookmark?.children?.length && bookmark.url)

</script>
<template>
  <template v-if="isLink">
    <el-icon class="el-icon--left icon" :size="iconSize">
      <BookmarkFavicon :url="bookmark.url" />
    </el-icon>
    <el-link>
      {{ bookmark.title }}
    </el-link>
  </template>
  <template v-else>
    <el-icon :size="iconSize" class="el-icon--left icon">
      <Folder />
    </el-icon>
    <span>{{ bookmark.title }}</span>
  </template>
</template>
<style scoped>
.icon {
  flex-shrink: 0;
}
:deep(.el-link__inner) {
  align-items: baseline;
}
</style>