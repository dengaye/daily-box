<script setup lang="ts">
import { Folder } from '@element-plus/icons-vue'
import BookmarkFavicon from '@/common/components/BookmarkFavicon/index.vue'

const { iconUrl, title, iconSize, isLink } = defineProps<{ iconUrl: string, title: string, iconSize: number, isLink?: boolean }>()

</script>
<template>
  <template v-if="isLink">
    <el-icon class="el-icon--left icon" :size="iconSize">
      <BookmarkFavicon :url="iconUrl" />
    </el-icon>
    <el-link>
      {{ title }}
    </el-link>
  </template>
  <template v-else>
    <el-icon :size="iconSize" class="el-icon--left icon">
      <Folder />
    </el-icon>
    <span>{{ title }}</span>
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