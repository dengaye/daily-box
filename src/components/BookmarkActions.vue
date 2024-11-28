<script setup lang="ts">
import { ref, computed } from 'vue'
import { ActionsFolderBookmarkType, Bookmark } from '../types/bookmark'
import { ElMessageBox } from 'element-plus'
import { MoreFilled } from '@element-plus/icons-vue'
import ActionLinkDialog from './ActionLinkDialog.vue'
import ActionFolderDialog from './ActionFolderDialog.vue'
import store from '../store'

const props = defineProps<{
  bookmark: Bookmark
}>()

const isFolder = computed(() => !!props.bookmark.children || !props.bookmark.url)

const actionLinkDialogRef = ref()
const actionFolderDialogRef = ref()

const handleEdit = (e: Event) => {
  e.stopPropagation()
  isFolder.value ? actionFolderDialogRef?.value?.showDialog?.() : actionLinkDialogRef?.value?.showDialog?.()
}

const handleDelete = async (e: Event) => {
  e.stopPropagation()
  await ElMessageBox.confirm(
    `确定要删除该${isFolder.value ? '文件夹' : '书签'} “${props.bookmark.title}” 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  await chrome.bookmarks.removeTree(String(props.bookmark?.id))
  store.deleteBookmarkDetailById(props.bookmark.id)
}
</script>

<template>
  <div class="actions" @click.stop>
    <el-dropdown trigger="click">
      <el-button type="info" text>
        <el-icon class="more-icon">
          <MoreFilled />
        </el-icon>
      </el-button>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleEdit">
            {{ isFolder ? '重命名' : '修改' }}
          </el-dropdown-item>
          <el-dropdown-item @click="handleDelete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 编辑标签 -->
    <ActionLinkDialog ref="actionLinkDialogRef" :type="ActionsFolderBookmarkType.EDIT" :bookmark="bookmark" />
    <!-- 编辑文件夹 -->
    <ActionFolderDialog ref="actionFolderDialogRef" :type="ActionsFolderBookmarkType.EDIT" :bookmark="bookmark" />
  </div>
</template>
<style scoped>
.actions {
  position: absolute;
  right: 6px;
  top: 50%;
  margin-top: -14px;
}
.more-icon {
  transform: rotate(90deg);
}
</style>