<script setup lang="ts">
import { ref, computed } from 'vue'
import { ActionsFolderBookmarkType, Bookmark, CreateBookmarkParams } from '../types/bookmark'
import { ElMessageBox, ElNotification } from 'element-plus'
import { MoreFilled } from '@element-plus/icons-vue'
import ActionLinkDialog from './ActionLinkDialog.vue'
import ActionFolderDialog from './ActionFolderDialog.vue'
import store from '../store'
import { createChromeBookmark } from "../api/chromeBookmark"

const props = defineProps<{
  bookmark: Bookmark
}>()

const isFolder = computed(() => !!props.bookmark.children || !props.bookmark.url)

const actionLinkDialogRef = ref()
const actionFolderDialogRef = ref()
const deletedBookmarks = ref<Bookmark[]>([])

const handleEdit = (e: Event) => {
  e.stopPropagation()
  isFolder.value ? actionFolderDialogRef?.value?.showDialog?.() : actionLinkDialogRef?.value?.showDialog?.()
}

const handleDelete = async (e: Event) => {
  e.stopPropagation()
  await ElMessageBox.confirm(
    `确定要删除该${isFolder.value ? '文件夹' : '书签'} "${props.bookmark.title}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  await chrome.bookmarks.removeTree(String(props.bookmark?.id))
  store.updateDetail(props.bookmark.parentId)
  deletedBookmarks.value.push(props.bookmark)
  handleRestore()
}

const handleRestore = () => {
  const notification = ElNotification({
    title: '标签已删除',
    message: '点击此框可以撤销删除',
    type: 'warning',
    duration: 5000,
    position: 'bottom-right',
    onClick: async () => {
      const bookmarkToRestore = deletedBookmarks.value[deletedBookmarks.value.length - 1]
      if (bookmarkToRestore) {
        try {
          const params: CreateBookmarkParams = {
            parentId: bookmarkToRestore.parentId,
            title: bookmarkToRestore.title,
            url: bookmarkToRestore.url
          }
          await createChromeBookmark(params)
          deletedBookmarks.value.pop()
          store.updateDetail(bookmarkToRestore.parentId)
          notification.close()
          ElNotification({
            title: '恢复成功',
            message: `标签 "${bookmarkToRestore.title}" 已恢复`,
            type: 'success',
            duration: 3000
          })
        } catch (error) {
          console.error('恢复标签失败', error)
          ElNotification({
            title: '恢复失败',
            message: '无法恢复标签，请重试',
            type: 'error'
          })
        }
      }
    }
  })
}

const handlePin = (e: Event) => {
  e.stopPropagation()
  store.pinBookmark(props.bookmark.id)
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
          <el-dropdown-item @click="handlePin">置顶</el-dropdown-item>
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
.deleted-bookmarks-dialog {
  min-width: 400px;
}
.deleted-bookmarks-list {
  max-height: 400px;
  overflow-y: auto;
}
.bookmark-item:hover {
  background-color: #f5f7fa;
}
.bookmark-item button:hover {
  background-color: #409eff;
  color: white;
}
</style>