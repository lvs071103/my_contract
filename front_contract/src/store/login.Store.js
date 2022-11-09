// login module
import { getToken, http, removeToken, setToken } from '@/utils'
import { makeAutoObservable } from 'mobx'

class LoginStore {
  token = getToken() || ''
  constructor() {
    // 响应式
    makeAutoObservable(this)
  }

  getToken = async ({ username, password }) => {
    console.log(username, password)
    // 调用登陆接口
    // 存入token
    const response = await http.post('http://localhost:8000/api/token/', {
      "username": username, "password": password
    })
    // 存入token
    this.token = response.data.access
    // 存入localStorage
    setToken(this.token)
  }

  // 退出
  loginOut = () => {
    this.token = ''
    // 移除token
    removeToken()
  }
}

export default LoginStore