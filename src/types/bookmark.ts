interface BookmarkChildren {
  id: string
  parentId: string
  url?: string
  title?: string
  index: number
}

export interface Bookmark extends BookmarkChildren {
  children?: Bookmark[]
}

export enum ActionsFolderBookmarkType {
  CREATE = 'create',
  EDIT = 'edit'
}
