
import { Bookmark } from '../types/bookmark'

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const genaratorBookmark: any = (bookmarkNodes: Bookmark[]) => {
  if (Array.isArray(bookmarkNodes)) {
    const length = bookmarkNodes.length - 1;
    const random = getRandomInt(0, length);
    const bookmark = bookmarkNodes[random];
    if (bookmark.children && bookmark.children.length > 0) {
      return genaratorBookmark(bookmark.children);
    }
    return bookmark;
  }
}