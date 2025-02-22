<script setup lang="ts">
import { computed } from 'vue'
import { Bookmark } from '@/types/bookmark'
import BasicBookmarkItem from '@/common/components/BasicBookmarkItem/index.vue'

const { bookmark, iconSize } = defineProps<{ bookmark: Bookmark, iconSize: number }>()

const isLink = computed(() => !bookmark?.children?.length && bookmark.url)
const iconUrl = computed(() => bookmark.url || '')
const title = computed(() => bookmark.title || '')
</script>

<template>
  <BasicBookmarkItem 
    :is-link="!!isLink" 
    :icon-size="iconSize"
    :icon-url="iconUrl"
    :title="title"
  />
</template>