<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AsideTree from './components/AsideTree.vue'
import DailySummary from './components/DailySummary.vue'
import BookMarkDetail from './components/BookmarkDetail.vue'
import asideStore from './store/aside'
import store from './store'

const loading = ref(true)

onMounted(() => {
  loading.value = true
  document.addEventListener('DOMContentLoaded', async () => {
    await store.init()
    loading.value = false
  });
})

</script>

<template>
  <div class="layout-container" v-if="!loading">
    <aside :class="['aside', { 'collapsed': asideStore.isCollapsed }]">
      <AsideTree />
    </aside>
    
    <main class="main custom-scrollbar" :class="{ 'expanded': asideStore.isCollapsed }">
      <DailySummary :sourceData="store.sourceData" />
      <BookMarkDetail />
    </main>
  </div>
</template>
<style scoped>
.layout-container {
  display: flex;
  position: relative;
}

.aside {
  width: 260px;
  transition: transform 0.3s ease;
  padding: 20px 0 20px 20px;
  overflow: hidden;
}

.aside.collapsed {
  transform: translateX(-250px);
}

.main {
  flex: 1;
  margin-left: 20px;
  transition: margin-left 0.3s ease;
  max-height: 100vh;
  overflow-y: auto;
}

.main.expanded {
  margin-left: -240px;
}
</style>