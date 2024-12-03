import { ref } from 'vue'

export function useDrag<T>() {
  const draggedItem = ref<T | null>(null)
  const dragOverIndex = ref<number>(-1)

  const onDragStart = (item: T) => {
    draggedItem.value = item
  }

  const onDragEnd = () => {
    draggedItem.value = null
    dragOverIndex.value = -1
  }

  const onDragOver = (e: DragEvent, index: number) => {
    e.preventDefault()
    dragOverIndex.value = index
  }

  const onDrop = () => {
    const result = {
      draggedItem: draggedItem.value
    }
    return result
  }

  return {
    dragOverIndex,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop
  }
} 