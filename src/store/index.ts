import { reactive } from 'vue'
import { Bookmark } from '../types/bookmark'
import { formatBookmarkToTree } from '../utils/bookmark'

class BookmarkStore {
  // 书签详情相关
  markbookDetail: Bookmark | null = null
  
  // 导航路径
  navPath: Bookmark[] = []
  
  // 数据源
  sourceData: Bookmark[] = []
  originSourceData: Bookmark[] = []

  // 初始化数据
  async init({ noSetSourceData = true } = {}): Promise<void> {
    return new Promise((resolve) => {
      chrome.bookmarks.getTree((bookmarkNodes: any) => {
        const originData = bookmarkNodes?.[0] || []
        if (noSetSourceData) {
          this.sourceData = formatBookmarkToTree(bookmarkNodes)
        }
        this.setDetail(originData)
        this.originSourceData = originData
        this.navPath = []
        resolve()
      })
    })
  }

  setDetail(data: Bookmark | null): void {
    this.markbookDetail = data
  }

  deleteDetail(id: string): void {
    if (!this.markbookDetail) return
    
    if (id === this.markbookDetail.id) {
      this.markbookDetail = null
      return
    }

    if (this.markbookDetail.children) {
      this.markbookDetail.children = this.markbookDetail.children.filter(
        item => item.id !== id
      )
    }
  }

  updateDetail(data: Partial<Bookmark> & { id: string }): void {
    if (!this.markbookDetail) return

    if (data.id === this.markbookDetail.id) {
      this.markbookDetail = { ...this.markbookDetail, ...data }
      return
    }

    if (this.markbookDetail.children) {
      this.markbookDetail.children = this.markbookDetail.children.map(
        item => item.id === data.id ? { ...item, ...data } : item
      )
    }
  }

  insertChild(data: Bookmark): void {
    if (!this.markbookDetail) return

    if (!this.markbookDetail.children) {
      this.markbookDetail.children = []
    }
    this.markbookDetail.children.push(data)
  }

  // 导航路径相关方法
  setNavPath(path: Bookmark[]): void {
    this.navPath = path
  }
}

export default reactive(new BookmarkStore())
