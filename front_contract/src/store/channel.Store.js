import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'

class ChannelStore {
  channelList = []
  constructor() {
    makeAutoObservable(this)
  }
  // article publish要用， 哪里调用这个函数呢？
  loadChannelList = async () => {
    const res = await http.get('/group/list')
    // console.log("loadChannelStore")
    this.channelList = res.data.data
  }
}

export default ChannelStore