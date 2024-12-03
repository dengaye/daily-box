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

  async init({ noSetSourceData = true } = {}): Promise<void> {
    const bookmarkNodes: any = await chrome.bookmarks.getTree()
    const originData = bookmarkNodes?.[0] || []
    if (noSetSourceData) {
      this.sourceData = formatBookmarkToTree(bookmarkNodes)
    }
    this.setDetail(originData)
    this.originSourceData = originData
    this.navPath = []
  }

  setDetail(data: Bookmark | null): void {
    this.markbookDetail = data
  }

  async updateDetail(id: string): Promise<void> {
    const bookmarks: any = await chrome.bookmarks.getSubTree(id)
    this.setDetail( bookmarks?.[0])
  }

  setNavPath(path: Bookmark[]): void {
    this.navPath = path
  }

  async pinBookmark(bookmarkId: string) {
    const bookmark = await chrome.bookmarks.get(bookmarkId)
    if (!bookmark?.[0] || !bookmark[0].parentId) return
    
    await chrome.bookmarks.move(bookmarkId, {
      parentId: bookmark[0].parentId,
      index: 0
    })

    this.updateDetail(bookmark[0].parentId)
  }
}

export default reactive(new BookmarkStore())
