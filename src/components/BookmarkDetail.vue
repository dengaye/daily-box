<script setup lang="ts">
import { ref, computed } from 'vue'
import store from '../store'
import { ActionsFolderBookmarkType, Bookmark } from '../types/bookmark'

const props = defineProps<{ type: ActionsFolderBookmarkType, bookmark?: Bookmark }>()

const showFolderDialog = ref(false)
const folderForm = ref({ name: props.bookmark?.title || '' })
const folderFormRef = ref()

const isCreateDialog = computed(() => props.type === ActionsFolderBookmarkType.CREATE)

// 创建文件夹
const createFolder = async () => {
  await folderFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const newBookmark: any = await chrome.bookmarks.create({
        parentId: store.markbookDetail?.id,
        title: folderForm.value.name
      });
      store.insertBookmarkDetailChildren(newBookmark)
    }
  })
}

const editFolder = async () => {
  const updateParams = {
    title: folderForm.value.name
  }
  const bookmarkId = props.bookmark?.id || ''
  await chrome.bookmarks.update(bookmarkId, updateParams)
  store.updateBookmarkDetailById({ id: bookmarkId, ...updateParams })
}

const handleEditSubmit = async () => {
  await folderFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (isCreateDialog.value) {
        await createFolder()
      } else {
        await editFolder()
      }
      showFolderDialog.value = false
      folderForm.value.name = ''
    }
  })
}

defineExpose({
  showDialog: () => showFolderDialog.value = true
})
</script>
<template>
  <el-dialog v-model="showFolderDialog" :title="isCreateDialog ? '新建文件夹' : '重命名文件夹'" width="30%">
    <el-form
      ref="folderFormRef"
      :model="folderForm"
      :rules="{
      name: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
          { min: 1, message: '文件夹名称不能为空', trigger: 'blur' }
        ]
      }"
      @submit.prevent="handleEditSubmit"
      @keyup.enter="handleEditSubmit"
    >
      <el-form-item label="文件夹名称" prop="name">
        <el-input v-model="folderForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showFolderDialog = false">取消</el-button>
      <el-button type="primary" @click="handleEditSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
<style lang="">

</style>