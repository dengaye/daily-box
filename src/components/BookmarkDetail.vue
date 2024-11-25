<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue'
import store from '../store'
import { Bookmark } from '../types/bookmark'
import { faviconURLInChromeExtends } from '../utils/bookmark'

const handleClick = (data: Bookmark) => {
  if (data.children?.length) {
    store.updateMarkbookDetail(data)
  } else {
    window.open(data.url)
  }
}

</script>
<template>
  <el-card shadow="always" v-if="store.markbookDetail?.title" class="container">
    <el-space wrap>
      <el-card v-for="item in store.markbookDetail?.children" :key="item.id" @click="() => handleClick(item)" class="card">
        <el-icon v-if="item?.children?.length" :size="20" class="icon">
          <FolderOpened />
        </el-icon>
        <el-image
          v-else
          :src="faviconURLInChromeExtends(item.url, '20')"
          fit="cover"
          class="img"
          crossorigin="anonymous"
        />
        {{ item.title }}
      </el-card>
    </el-space>
  </el-card>
</template>
<style lang="css" scoped>
.container {
  margin-top: 10px;
}
.icon {
  vertical-align: bottom;
}
.card {
  cursor: pointer;
}
.img {
  vertical-align: bottom;
  border-radius: 50%;
}
</style>