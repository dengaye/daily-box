import { Bookmark } from '../types/bookmark'
import store from '../store'
import { findBookmarkNav } from '../utils/bookmarkNav'

export function useClickBookmarkItem() {
  const handleClickBookmarkItem = (bookmark: Bookmark) => {
    if (bookmark.url) {
      window.open(bookmark.url)
    } else {
      store.setDetail(bookmark)
      const path = findBookmarkNav(store.sourceData, bookmark.id)
      store.setNavPath(path)
    }
  }

  return {
    handleClickBookmarkItem
  }
}