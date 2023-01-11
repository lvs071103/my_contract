import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'

class CategoryStore {
  categoryList = []
  constructor() {
    makeAutoObservable(this)
  }
  // 获取合同类型，并存入store
  loadCategoryList = async () => {
    const res = await http.get('/contract/category/list')
    this.categoryList = res.data.data
  }
}

export default CategoryStore