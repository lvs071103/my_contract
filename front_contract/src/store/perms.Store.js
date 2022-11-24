import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'

class PermsStore {
  permsList = []
  constructor() {
    makeAutoObservable(this)
  }
  // article publish要用， 哪里调用这个函数呢？
  loadPermslList = async () => {
    const res = await http.get('/accounts/permission/list')
    // console.log(res.data.permissions)
    this.permsList = res.data.permissions
  }
}

export default PermsStore