import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'

class GroupStore {
  groupList = []
  constructor() {
    makeAutoObservable(this)
  }
  // group用户组信息调用该函数
  loadGroupList = async () => {
    const res = await http.get('/accounts/group/list')
    // console.log(res.data)
    this.groupList = res.data.groups
  }
}

export default GroupStore