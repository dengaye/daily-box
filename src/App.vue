<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Tree from './components/Tree.vue'
import DailySummary from './components/DailySummary.vue'
import { Bookmark } from "./types/bookmark.ts"
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

onMounted(() => {
  document.addEventListener('DOMContentLoaded', function () {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      let newData: any[] = []
      if (bookmarkTreeNodes?.length === 1) {
        if (newData?.[0]?.title) {
          newData = bookmarkTreeNodes
        } else {
          newData = bookmarkTreeNodes[0].children
        }
      } else {
        newData = bookmarkTreeNodes
      }
      sourceData.value = newData
    });
  });
})

</script>

<template>
  <section>
    <el-container v-if="sourceData?.length">
      <el-aside>
        <Tree :sourceData="sourceData"/>
      </el-aside>
      <el-main>
        <DailySummary :sourceData="sourceData" />
      </el-main>
    </el-container>
  </section>
</template>
