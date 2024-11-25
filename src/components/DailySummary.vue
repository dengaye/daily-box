<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bookmark } from '../types/bookmark'
import { genaratorBookmark } from '../utils/genaratorBookmark'
import { DAILY_MSG_STORAGE_KEY_PREFIX } from '../constants/storage'
import { getTodayTime } from '../utils'

const props = defineProps<{
  sourceData: Bookmark[]
}>()

const dailyBookmark = ref()
const todayTime = ref('')

onMounted(() => {
  const time = getTodayTime()
  todayTime.value = time
  const localStorageKey = `${DAILY_MSG_STORAGE_KEY_PREFIX}${time}`
  let bookmark = localStorage.getItem(localStorageKey);
  if (bookmark) {
    bookmark = JSON.parse(bookmark);
  } else {
    bookmark = genaratorBookmark(props.sourceData)
    localStorage.setItem(localStorageKey, JSON.stringify(bookmark));
  }
  dailyBookmark.value = bookmark
})

</script>

<template>
  <el-card shadow="always">
    <template #header>
      每日一览 <el-text class="mx-1" size="small">{{todayTime}}</el-text>
    </template>
    <el-link class="text item" :href="dailyBookmark.url" v-if="dailyBookmark" target="_blank">{{ dailyBookmark.title }}</el-link>
  </el-card>
</template>
