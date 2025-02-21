const CURRENT_BOOKMARK_ID_STORAGE_KEY = 'daily-box-current-bookmark-id'

export const setCurrentBookmarkId = (id: string) => {
  localStorage.setItem(CURRENT_BOOKMARK_ID_STORAGE_KEY, id)
}

export const getCurrentBookmarkId = (): string | null => {
  const id = localStorage.getItem(CURRENT_BOOKMARK_ID_STORAGE_KEY)
  if (id) {
    return id
  }
  return null
}
