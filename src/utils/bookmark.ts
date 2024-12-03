import { Bookmark } from "../types/bookmark"
import { getRandomInt } from './index'

/** 生成图标 */
export function faviconURLInChromeExtends(pageUrl: string, size: string) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"))
  url.searchParams.set('pageUrl', pageUrl)
  url.searchParams.set('size', size)
  return url.toString()
}

/**
 * 初始时，格式化 bookmark 数据
 */
export const formatBookmarkToTree = (bookmarkTreeNodes: Bookmark[]) => {
  let newData: Bookmark[] = []
	if (bookmarkTreeNodes?.length === 1) {
		if (newData?.[0]?.title) {
			newData = bookmarkTreeNodes
		} else {
			newData = bookmarkTreeNodes[0].children || []
		}
	} else {
		newData = bookmarkTreeNodes
	}

	function filterEmpty(list: Bookmark[]) {
		for(const item of list) {
			if (item.children?.length) {
				filterEmpty(item.children)
			} else if (item.children){
				delete item.children
			}
		}
	}

	filterEmpty(newData)

	return newData
}

/**
 * 根据书签数据，随机生成一个标签
 */
export const genaratorBookmark: any = (bookmarkNodes: Bookmark[]) => {
  if (Array.isArray(bookmarkNodes)) {
    const length = bookmarkNodes.length - 1
    const random = getRandomInt(0, length)
    const bookmark = bookmarkNodes[random]
    if (bookmark?.children?.length) {
      return genaratorBookmark(bookmark.children)
    }
		if (!bookmark?.url) {
			return genaratorBookmark(bookmarkNodes)
		}
    return bookmark;
  }
}