<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue'
import store from '../store/index'
import { Bookmark } from '../types/bookmark'
import BookmarkFavicon from './BookmarkFavicon.vue'

const handleClick = (data: Bookmark) => {
  if (data.children?.length) {
    store.updateMarkbookDetail(data)
  } else {
    window.open(data.url)
  }
}

const isLink = (item: Bookmark) => {
  return !item?.children?.length
}

</script>
<template>
  <el-card shadow="always" v-if="store.markbookDetail" class="container">
    <el-space wrap>
      <el-card v-for="item in store.markbookDetail?.children" :key="item.id" @click="() => handleClick(item)" class="card">
        <el-icon v-if="!isLink(item)" :size="20" class="el-icon--left icon">
          <FolderOpened />
        </el-icon>
        <el-icon class="el-icon--left" v-else :size="20">
          <BookmarkFavicon :url="item.url" />
        </el-icon>
        <el-link v-if="isLink(item)">
          {{ item.title }}
        </el-link>
        <span v-else>{{ item.title }}</span>
      </el-card>
    </el-space>
  </el-card>
</template>
<style lang="css" scoped>
.container {
  margin-top: 10px;
}
.container :deep(.el-card__body) {
  display: inline-flex
}
.icon {
  vertical-align: bottom;
}
.card {
  cursor: pointer;
}
</style>