import { http } from "@/utils"
import { makeAutoObservable } from "mobx"

class UserStore {
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
  }
  getUserInfo = async () => {
    // 调用用户接口获取数据
    const res = await http.get('/accounts/user/profile')
    this.userInfo = res.data
  }
}

export default UserStore