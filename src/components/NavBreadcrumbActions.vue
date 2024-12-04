<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { BOOKMARK_ITEM_DIRECTION_STORAGE_KEY } from '../constants/storage'

const emit = defineEmits(['update:hasVertical'])
const value = ref(localStorage.getItem(BOOKMARK_ITEM_DIRECTION_STORAGE_KEY) || 'horizontal')

const handleChange = (val: any) => {
  const hasVertical = val === 'vertical'
  localStorage.setItem(BOOKMARK_ITEM_DIRECTION_STORAGE_KEY, val)
  emit('update:hasVertical', hasVertical)
}

onMounted(() => {
  const hasVertical = value.value === 'vertical'
  emit('update:hasVertical', hasVertical)
})
</script>
<template>
  <el-radio-group size="small" v-model="value" @change="handleChange">
    <el-radio-button label="-__-" value="horizontal" />
    <el-radio-button label="—" value="vertical" />
  </el-radio-group>
</template>
