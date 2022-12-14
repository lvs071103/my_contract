// 把所有的模块做统一处理
// 导出一个统一的方法: useStore
import LoginStore from "./login.Store"
import React from "react"
import UserStore from "./user.Store"
import PermsStore from "./perms.Store"
import GroupStore from "./group.Store"
import CategoryStore from './categories.Store'
import SuppliersStore from "./suppliers.Store"

class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.groupStore = new GroupStore()
    this.permsStore = new PermsStore()
    this.categoryStore = new CategoryStore()
    this.suppliersStore = new SuppliersStore()
  }
}

// 实例化根
// 导出useStore context
const rootStore = new RootStore()
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)

export { useStore }