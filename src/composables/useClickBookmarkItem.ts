import { Bookmark } from '../types/bookmark'
import store from '../store'

export function useClickBookmarkItem() {
  const findNodePath = (tree: Bookmark[], targetId: string, path: Bookmark[] = []): Bookmark[] => {
    for (const node of tree) {
      if (node.id === targetId) {
        return [...path, node]
      }
      if (node.children?.length) {
        const foundPath = findNodePath(node.children, targetId, [...path, node])
        if (foundPath.length) return foundPath
      }
    }
    return []
  }

  const handleClickBookmarkItem = (bookmark: Bookmark) => {
    if (bookmark.url) {
      window.open(bookmark.url)
    } else {
      store.setDetail(bookmark)
      const path = findNodePath(store.sourceData, bookmark.id)
      store.setNavPath(path)
    }
  }

  return {
    handleClickBookmarkItem
  }
}