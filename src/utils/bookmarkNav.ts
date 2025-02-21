import { Bookmark } from './../types/bookmark';

export const findBookmarkNav = (data: Bookmark[], targetId: string): Bookmark[] => {
  const result: Bookmark[] = []

  const find = (bookmark: Bookmark): boolean => {
    if (Number(bookmark.id) === Number(targetId)) {
      result.push(bookmark)
      return true
    }

    if (bookmark.children) {
      for (const child of bookmark.children) {
        if (find(child)) {
          result.push(bookmark)
          return true
        }
      }
    }

    return false
  }
  // 遍历 data 中的每一项
  for (const bookmark of data) {
    if (find(bookmark)) {
      break
    }
  }

  return result.reverse()
}
