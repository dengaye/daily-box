import { reactive } from 'vue'
import { Bookmark } from '../types/bookmark'
import { formatBookmarkToTree } from '../utils/bookmark'
import { setCurrentBookmarkId, getCurrentBookmarkId } from '../utils/storage'
import { getChromeBookmarkById } from '../api/chromeBookmark'
import { findBookmarkNav } from '../utils/bookmarkNav'

class BookmarkStore {
  // 书签详情相关
  markbookDetail: Bookmark | null = null

  // 导航路径
  navPath: Bookmark[] = []
  
  // 数据源
  sourceData: Bookmark[] = []

  async init(): Promise<void> {
    const bookmarkNodes: any = await chrome.bookmarks.getTree()
    this.sourceData = formatBookmarkToTree(bookmarkNodes)
    const currentBookmarkId = getCurrentBookmarkId()
    if (currentBookmarkId) {
      const cacheBookmarks: any = await this.getDataFromCache()
      if (cacheBookmarks) {
        this.setDetail(cacheBookmarks)
        this.navPath = findBookmarkNav(this.sourceData, currentBookmarkId)
        console.log( this.navPath )
        return
      }
    }
    this.setDetail(bookmarkNodes?.[0] || [])
  }

  async updateMarkBookDetailByApi() {
    const bookmarkNodes: any = await chrome.bookmarks.getTree()
    this.setDetail(bookmarkNodes?.[0] || [])
    this.navPath = []
  }

  setDetail(data: Bookmark | null): void {
    this.markbookDetail = data
    setCurrentBookmarkId(data?.id || '')
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

  private async getDataFromCache() {
    const currentBookmarkId = getCurrentBookmarkId()
    if (currentBookmarkId) {
      const bookmarks = await getChromeBookmarkById(currentBookmarkId)
      if (Number(bookmarks?.id) === 0 && !bookmarks?.title) {
        return null
      }
      return bookmarks
    }
  }
}

export default reactive(new BookmarkStore())
