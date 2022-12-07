import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'

class TypesStore {
  typeList = []
  constructor() {
    makeAutoObservable(this)
  }
  // 获取合同类型，并存入store
  loadTypeList = async () => {
    const res = await http.get('/contract/contract/getTypes')
    this.typeList = res.data.types
  }
}

export default TypesStore