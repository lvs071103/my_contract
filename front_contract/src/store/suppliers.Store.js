import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'

class SuppliersStore {
  supplierList = []
  constructor() {
    makeAutoObservable(this)
  }
  // 获取合同类型，并存入store
  loadSupplierList = async () => {
    const res = await http.get('/contract/supplier/list')
    this.supplierList = res.data.data
  }
}

export default SuppliersStore