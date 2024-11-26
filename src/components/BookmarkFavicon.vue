<template>
  <el-image :src="faviconURLInChromeExtends(url || '', '20')" fit="cover" class="img" crossorigin="anonymous" />
</template>
<script lang="ts" setup>
import { faviconURLInChromeExtends } from '../utils/bookmark'
defineProps<{ url?: string }>()
</script>
<style scoped>
.img {
  vertical-align: bottom;
  border-radius: 50%;
}
</style>