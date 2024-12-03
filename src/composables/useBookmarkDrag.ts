import { Bookmark } from '../types/bookmark'
import store from '../store'
import { useDrag } from './useDrag'

export function useBookmarkDrag() {
  const {
    dragOverIndex,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop
  } = useDrag<Bookmark>()

  const handleDragStart = (item: Bookmark) => {
    onDragStart(item)
  }

  const handleDragEnd = () => {
    onDragEnd()
  }

  const handleDragOver = (e: DragEvent, index: number) => {
    onDragOver(e, index)
  }

  const handleDrop = async (index: number) => {
    const { draggedItem } = onDrop()
    if (!draggedItem || !store.markbookDetail?.children) return

    const fromIndex = store.markbookDetail.children.findIndex(
      bookmark => bookmark.id === draggedItem.id
    )
    
    try {
      await chrome.bookmarks.move(draggedItem.id, {
        parentId: store.markbookDetail.id,
        index
      })
      const newItems = [...store.markbookDetail.children]
      newItems.splice(fromIndex, 1)
      newItems.splice(index, 0, draggedItem)
      store.markbookDetail.children = newItems
    } catch (error) {
      console.error('书签顺序更新失败:', error)
    } finally {
      handleDragEnd()
    }
  }

  return {
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  }
} 