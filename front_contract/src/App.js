import React, { Component, lazy, Suspense } from 'react'
import { unstable_HistoryRouter as HistoryRouter, Route, Routes } from 'react-router-dom'
import AuthRoute from './components/AuthRoute'
import './index.scss'
import { history } from '@/utils/history'
// 按需导入

const Login = lazy(() => import('@/pages/Login'))
const GeekLayout = lazy(() => import('@/pages/Layout'))
const Home = lazy(() => import('@/pages/Home'))
const User = lazy(() => import('@/pages/User'))
const Group = lazy(() => import('@/pages/Group'))
const Contract = lazy(() => import('@/pages/Contract'))
const Supplier = lazy(() => import('@/pages/Suppliers'))
const SubmitForm = lazy(() => import('@/pages/Submit'))

export default class App extends Component {
  render () {
    return (
      // 路由配置
      <HistoryRouter history={history}>
        <Suspense
          fallback={
            <div
              style={{
                textAlign: 'center',
                marginTop: 200
              }}
            >
              loading...
            </div>
          }
        >
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
              <Route path='/contract/contract/list' element={<Contract />}></Route>
              <Route path='/contract/supplier/list' element={<Supplier />}></Route>
              <Route path='/contract/contract/add' element={<SubmitForm />}></Route>
            </Route>
            <Route path='/login/' element={<Login />}></Route>
          </Routes>
        </Suspense>

      </HistoryRouter>
    )
  }
}
