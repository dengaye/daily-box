<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Tree from './components/Tree.vue'
import DailySummary from './components/DailySummary.vue'
import { Bookmark } from "./types/bookmark"
import { formatBookmarkToTree } from './utils/formatBookmarkToTree'
// import { useDark, useToggle } from "@vueuse/core"

// const isDark = useDark({
//   selector: 'html',
//   attribute: 'class',
//   valueDark: 'dark',
//   valueLight: 'light'
// })
// const toggleDark = useToggle(isDark)
// toggleDark()

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
        <Tree :sourceData="sourceData"/>
      </el-aside>
      <el-main>
        <DailySummary :sourceData="sourceData" />
      </el-main>
    </el-container>
  </section>
</template>
