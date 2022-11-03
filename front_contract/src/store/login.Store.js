// login module
import { getToken, http, removeToken, setToken } from '@/utils'
import { makeAutoObservable } from 'mobx'

class LoginStore {
  token = getToken() || ''
  constructor() {
    // 响应式
    makeAutoObservable(this)
  }
  getToken = async ({ mobile, code }) => {
    // 调用登陆接口
    // 存入token
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile, code
    })
    console.log(res.data)
    // 存入token
    // runInAction(() => {
    //   this.token = res.data.token
    // })
    this.token = res.data.token
    // 存入localStorage
    setToken(this.token)
  }

  loginOut = () => {
    this.token = ''
    removeToken()
  }
}

export default LoginStore