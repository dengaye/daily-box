<script setup lang="ts">
import { computed } from 'vue'
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

const hasData = computed(() => !!store.markbookDetail?.children?.length)

</script>
<template>
  <el-card shadow="always" v-if="store.markbookDetail" class="container" :class="{ empty: !hasData }">
    <el-space wrap>
      <template v-if="hasData">
        <el-card v-for="item in store.markbookDetail?.children" :key="item.id" @click="() => handleClick(item)" class="card">
          <BookmarkItem :icon-size="20" :bookmark="item" />
        </el-card>
      </template>
      <el-empty v-else description="空" />
    </el-space>
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
}
</style>