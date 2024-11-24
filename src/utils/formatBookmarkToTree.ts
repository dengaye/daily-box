import { Bookmark } from "../types/bookmark";

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

	console.log("newData", newData)

	return newData
}
