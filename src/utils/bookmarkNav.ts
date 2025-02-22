import { Bookmark } from './../types/bookmark';

export const findBookmarkNav = (data: Bookmark[], targetId: string): Bookmark[] => {
  const parentMap = new Map<string, Bookmark>();
  
  const buildParentMap = (bookmarks: Bookmark[], parent?: Bookmark) => {
    for (const bookmark of bookmarks) {
      if (parent) {
        parentMap.set(bookmark.id, parent);
      }
      if (bookmark.children?.length) {
        buildParentMap(bookmark.children, bookmark);
      }
    }
  };
  
  buildParentMap(data);
  
  const result: Bookmark[] = [];
  let current: Bookmark | undefined;
  
  const findStart = (bookmarks: Bookmark[]): boolean => {
    for (const bookmark of bookmarks) {
      if (Number(bookmark.id) === Number(targetId)) {
        current = bookmark;
        return true;
      }
      if (bookmark.children?.length && findStart(bookmark.children)) {
        return true;
      }
    }
    return false;
  };
  
  if (!findStart(data)) {
    return [];
  }
  
  while (current) {
    result.push(current);
    current = parentMap.get(current.id);
  }
  
  return result.reverse();
}
