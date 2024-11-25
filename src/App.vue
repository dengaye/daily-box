<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AsideTree from './components/AsideTree.vue'
import DailySummary from './components/DailySummary.vue'
import BookMarkDetail from './components/BookmarkDetail.vue'
import { Bookmark } from "./types/bookmark"
import { formatBookmarkToTree } from './utils/bookmark'

const sourceData = ref<Bookmark[]>([])
const loading = ref(true)

onMounted(() => {
  loading.value = true
  document.addEventListener('DOMContentLoaded', function () {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes: any[]) {
      sourceData.value = formatBookmarkToTree(bookmarkTreeNodes)
      loading.value = false
    });
  });
})

</script>

<template>
  <section v-if="!loading">
    <el-container v-if="sourceData?.length">
      <el-aside class="aside">
        <AsideTree :sourceData="sourceData"/>
      </el-aside>
      <el-main>
        <DailySummary :sourceData="sourceData" />
        <BookMarkDetail />
      </el-main>
    </el-container>
  </section>
</template>
