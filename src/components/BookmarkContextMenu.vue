<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Folder, Link as BookmarkIcon } from '@element-plus/icons-vue'
import ActionLinkDialog from './ActionLinkDialog.vue'
import ActionFolderDialog from './ActionFolderDialog.vue'
import { ActionsFolderBookmarkType } from '../types/bookmark'

const props = defineProps<{
  visible: boolean
  position: { x: number; y: number }
}>()

const actionLinkDialogRef = ref()
const actionFolderDialogRef = ref()

// 添加新的引用
const dropdownRef = ref()

// 在显示时触发下拉菜单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      dropdownRef.value?.handleOpen()
    })
  }
})

const showLinkDialog = () => actionLinkDialogRef.value?.showDialog?.()
const showFolderDialog = () => actionFolderDialogRef.value?.showDialog?.()
</script>

<template>
  <el-dropdown ref="dropdownRef" trigger="contextmenu" :teleported="false"
    :style="{ position: 'fixed', left: position.x + 'px', top: position.y + 'px' }">
    <span class="dropdown-trigger"></span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="showFolderDialog">
          <el-icon>
            <Folder />
          </el-icon> 新建文件夹
        </el-dropdown-item>
        <el-dropdown-item @click="showLinkDialog">
          <el-icon>
            <BookmarkIcon />
          </el-icon> 新建书签
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <ActionLinkDialog ref="actionLinkDialogRef" :type="ActionsFolderBookmarkType.CREATE" />
  <ActionFolderDialog ref="actionFolderDialogRef" :type="ActionsFolderBookmarkType.CREATE" />
</template>

<style lang="css" scoped>
.dropdown-trigger {
  position: fixed;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>