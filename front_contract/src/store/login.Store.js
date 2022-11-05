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
    // const response = await fetch("http://localhost:8000/api/token/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     "username": username,
    //     "password": password
    //   })
    // })
    console.log(response.status)
    // 存入token
    // runInAction(() => {
    //   this.token = res.data.token
    // })
    this.token = response.data.access
    // 存入localStorage
    setToken(this.token)
  }

  loginOut = () => {
    this.token = ''
    removeToken()
  }
}

export default LoginStore