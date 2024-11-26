import { reactive } from 'vue'
import { Bookmark } from '../types/bookmark'

interface IStore {
  markbookDetail: Bookmark | null
  updateMarkbookDetail: (data: Bookmark | null) => void
}

const store = reactive<IStore>({
  markbookDetail:  null,
  updateMarkbookDetail(data: Bookmark | null) {
    this.markbookDetail = data
  }
})

export default store
