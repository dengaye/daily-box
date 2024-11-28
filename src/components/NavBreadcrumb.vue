<script lang="ts" setup>
import { computed } from 'vue'
import store from '../store'
import { HomeFilled } from '@element-plus/icons-vue'
import { Bookmark } from '../types/bookmark'

const navPath = computed(() => store.navPath)

const handleNavClick = (item: Bookmark) => {
  const index = navPath.value.findIndex(node => node.id === item.id)
  const newPath = navPath.value.slice(0, index + 1)
  store.setNavPath(newPath)
  store.setDetail(item)
}

const handleHomeClick = () => {
  if (!store.navPath.length) return 
  store.init({ noSetSourceData: false })
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      :class="{ 'is-link': !!navPath.length }"
      @click="handleHomeClick"
    >
      <el-icon :size="16">
        <HomeFilled />
      </el-icon>
    </el-breadcrumb-item>
    <el-breadcrumb-item 
      v-for="item in navPath" 
      :key="item.id"
      :class="{ 'is-link': true }"
      @click="handleNavClick(item)"
      v-if="navPath.length" 
    >
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.is-link {
  cursor: pointer;
}
.is-link:hover {
  color: var(--el-color-primary);
}
</style> 