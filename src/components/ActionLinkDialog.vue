<script setup lang="ts">
import { ref, computed } from 'vue'
import store from '../store'
import { ActionsFolderBookmarkType, Bookmark } from '../types/bookmark';

const props = defineProps<{ type: ActionsFolderBookmarkType, bookmark?: Bookmark }>()

const showBookmarkDialog = ref(false)
const bookmarkForm = ref({ name: props.bookmark?.title || '', url: props.bookmark?.url || '' })
const bookmarkFormRef = ref()

const emit = defineEmits(['update:visible'])

const isCreateDialog = computed(() => props.type === ActionsFolderBookmarkType.CREATE)

const createBookmark = async () => {
 await chrome.bookmarks.create({
    parentId: store.markbookDetail?.id,
    title: bookmarkForm.value.name,
    url: bookmarkForm.value.url
  });
  store.updateDetail(store.markbookDetail?.id || '')
}

const editBookmark = async () => {
  const updateParams = {
    title: bookmarkForm.value.name,
    url: bookmarkForm.value.url
  }
  const bookmarkId = props.bookmark?.id || ''
  await chrome.bookmarks.update(bookmarkId, updateParams)
  if (props.bookmark?.parentId) {
    store.updateDetail(props.bookmark.parentId)
  }
}

const handleEditSubmit = async () => {
  await bookmarkFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (isCreateDialog.value) {
        await createBookmark()
      } else {
        await editBookmark()
      }
      showBookmarkDialog.value = false
      bookmarkForm.value.name = ''
      bookmarkForm.value.url = ''
    }
  })
}

defineExpose({
  showDialog: () => showBookmarkDialog.value = true
})

</script>
<template>
  <el-dialog append-to-body v-model="showBookmarkDialog" :title="isCreateDialog ? '新建书签' : '修改书签'" width="30%">
    <el-form
      ref="bookmarkFormRef"
      :model="bookmarkForm"
      :rules="{
      name: [
          { required: true, message: '请输入书签名称', trigger: 'blur' },
          { min: 1, message: '不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入URL', trigger: 'blur' },
          { min: 1, message: '不能为空', trigger: 'blur' }
        ]
      }"
      @submit.prevent="handleEditSubmit"
      @keyup.enter="handleEditSubmit"
    >
      <el-form-item label="书签名称" prop="name">
        <el-input v-model="bookmarkForm.name" />
      </el-form-item>
      <el-form-item label="书签 URL" prop="url">
        <el-input v-model="bookmarkForm.url" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showBookmarkDialog = false">取消</el-button>
      <el-button type="primary" @click="handleEditSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
