import { Bookmark } from "../types/bookmark"

export interface CreateBookmarkParams {
  parentId: string
  title?: string
  url?: string
}

export const createChromeBookmark = async (params: CreateBookmarkParams) => {
  return await chrome.bookmarks.create({
    parentId: params.parentId,
    title: params.title,
    url: params.url
  })
}

export const removeChromeBookmark = async (id: string) => {
  return await chrome.bookmarks.removeTree(id)
}

export const updateChromeBookmark = async (id: string, updateInfo: Partial<Bookmark>) => {
  return await chrome.bookmarks.update(id, updateInfo)
}
