import React, { Component } from 'react'
import { unstable_HistoryRouter as HistoryRouter, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login'
import GeekLayout from '@/pages/Layout'
import AuthRoute from './components/AuthRoute'
import './index.scss'
import Home from './pages/Home'
import User from './pages/User'
import Contract from './pages/Contract'
import { history } from '@/utils/history'
import Group from '@/pages/Group'
// import UseEffectTest from './tools/useEffectTest'

export default class App extends Component {
  render () {
    return (
      // 路由配置
      <HistoryRouter history={history}>
        <Routes>
          {/* 创建路由path和组件对应关系 */}
          {/* Layout需要鉴权处理 */}
          <Route path='/' element={
            <AuthRoute>
              <GeekLayout />
            </AuthRoute>
          }>
            <Route index element={<Home />}></Route>
            {/* <Route path='/accounts' element={<User />}> */}
            <Route path='/accounts/user/list' element={<User />}></Route>
            <Route path='/accounts/group/list' element={<Group />}></Route>
            {/* </Route> */}
            {/* <Route path='/test/' element={<UseEffectTest name='Jack.Z' />}></Route> */}
            <Route path='/contract/' element={<Contract />}></Route>
          </Route>
          <Route path='/login/' element={<Login />}></Route>
        </Routes>
      </HistoryRouter>
    )
  }
}
