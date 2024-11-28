import { reactive } from 'vue'
import { ASIDE_COLLAPSED_STORAGE_KEY } from '../constants/storage'

class AsideStore {
  isCollapsed: boolean

  constructor() {
    this.isCollapsed = localStorage.getItem(ASIDE_COLLAPSED_STORAGE_KEY) === 'true'
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed
    localStorage.setItem(ASIDE_COLLAPSED_STORAGE_KEY, String(this.isCollapsed))
  }
}

export default reactive(new AsideStore())