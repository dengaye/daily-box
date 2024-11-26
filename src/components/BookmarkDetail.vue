<script setup lang="ts">
import store from '../store/index'
import { Bookmark } from '../types/bookmark'
import BookmarkItem from './BookmarkItem.vue'

const handleClick = (data: Bookmark) => {
  if (data.children?.length) {
    store.updateMarkbookDetail(data)
  } else {
    window.open(data.url)
  }
}

</script>
<template>
  <el-card shadow="always" v-if="store.markbookDetail" class="container">
    <el-space wrap>
      <el-card v-for="item in store.markbookDetail?.children" :key="item.id" @click="() => handleClick(item)" class="card">
        <BookmarkItem :icon-size="20" :bookmark="item" />
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