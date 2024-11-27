import { reactive } from 'vue'
import { Bookmark } from '../types/bookmark'

interface IStore {
  markbookDetail: Bookmark | null
  updateMarkbookDetail: (data: Bookmark | null) => void
  deleteBookmarkDetailById: (id: string) => void
  updateBookmarkDetailById: (data: Partial<Bookmark> & { id: string }) => void
  insertBookmarkDetailChildren: (data: Bookmark) => void
}

const store = reactive<IStore>({
  markbookDetail:  null,
  updateMarkbookDetail(data: Bookmark | null) {
    this.markbookDetail = data
  },
  deleteBookmarkDetailById(id: string) {
    if (id === this.markbookDetail?.id) return this.markbookDetail = null
    if (this.markbookDetail?.children) {
      this.markbookDetail.children = this.markbookDetail.children.filter(item => item.id !== id)
    }
  },
  updateBookmarkDetailById(data: Partial<Bookmark> & { id: string }) {
    if (data.id === this.markbookDetail?.id) {
      this.markbookDetail = {
        ...this.markbookDetail,
        ...data
      }
      return
    }
    if (this.markbookDetail?.children) {
      this.markbookDetail.children = this.markbookDetail.children.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      )
    }
  },
  insertBookmarkDetailChildren(data: Bookmark) {
    if (!this.markbookDetail) return
    if (this.markbookDetail?.children) {
      this.markbookDetail.children.push(data)
    } else {
      this.markbookDetail.children = [data]
    }
  }
})

export default store
