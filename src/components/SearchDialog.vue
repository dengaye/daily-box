<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { ElInput, ElScrollbar } from 'element-plus'
import BookmarkItem from './BookmarkItem.vue'
import { Bookmark } from '../types/bookmark'
import store from '../store'

const props = defineProps<{
  visible: boolean
  sourceData: Bookmark[]
}>()

const emit = defineEmits(['update:visible'])

const searchText = ref('')
const searchResults = ref<Bookmark[]>([])
const dialogVisible = ref(props.visible)
const selectedIndex = ref(-1)
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null)
const searchItemRefs = ref<HTMLElement[]>([])

watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

watch(searchText, (val) => {
  if (!val) {
    searchResults.value = []
    return
  }
  // 递归搜索所有书签
  const search = (items: Bookmark[]): Bookmark[] => {
    let results: Bookmark[] = []
    for (const item of items) {
      if (item.title?.toLowerCase().includes(val.toLowerCase())) {
        results.push(item)
      }
      if (item.children) {
        results = results.concat(search(item.children))
      }
    }
    return results
  }
  searchResults.value = search(props.sourceData)
})

const handleSelect = (item: Bookmark) => {
  if (item.url) {
    window.open(item.url)
  } else {
    store.setDetail(item)
  }
  dialogVisible.value = false
  searchText.value = ''
}

const handleKeydown = (e: KeyboardEvent | Event) => {
  if (searchResults.value.length === 0) return
  const event = e as KeyboardEvent

  switch(event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % searchResults.value.length
      break
    case 'ArrowUp': {
      event.preventDefault()
      selectedIndex.value = selectedIndex.value <= 0 
        ? searchResults.value.length - 1 
        : selectedIndex.value - 1
      break
    }
    case 'Enter': {
      if (selectedIndex.value !== -1) {
        handleSelect(searchResults.value[selectedIndex.value])
      }
      break
    }
    default:
      break
  }
}

watch(searchText, () => {
  selectedIndex.value = -1
})

watch(selectedIndex, async (newIndex) => {
  if (newIndex === -1) return
  
  await nextTick()
  const selectedElement = searchItemRefs.value[newIndex]
  if (selectedElement && scrollbarRef.value) {
    scrollbarRef.value.setScrollTop(selectedElement.offsetTop - 200)
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    width="560px"
    class="search-dialog"
    @opened="inputRef?.focus()"
  >
    <div class="search-input">
      <el-input
        ref="inputRef"
        v-model="searchText"
        placeholder="搜索书签..."
        :prefix-icon="Search"
        @keydown="handleKeydown"
      />
    </div>
    
    <el-scrollbar 
      ref="scrollbarRef"
      height="400px"
    >
      <template v-if="searchResults.length">
        <div
          v-for="(item, index) in searchResults"
          :key="item.id"
          :ref="(el) => { if (el) searchItemRefs[index] = el as HTMLElement }"
          class="search-item"
          :class="{ 'is-selected': index === selectedIndex }"
          @click="handleSelect(item)"
        >
          <BookmarkItem :bookmark="item" :icon-size="16" />
        </div>
      </template>
      <div v-else-if="searchText" class="no-result">
        未找到相关书签
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<style scoped>
.search-dialog :deep(.el-dialog__header) {
  display: none;
}
.search-dialog :deep(.el-dialog__body) {
  padding: 20px;
}
.search-input {
  margin-bottom: 10px;
}
.search-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  line-height: 20px;
  display: flex;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
}
.search-item:hover {
  background-color: var(--el-fill-color-light);
}
.no-result {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 20px 0;
}
.search-item.is-selected {
  background-color: var(--el-fill-color-light);
}
</style> 