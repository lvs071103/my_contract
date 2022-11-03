import React, { Component, Suspense } from 'react'
import { Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { history } from './utils/history'
import Login from './pages/Login'

export default class App extends Component {
  render () {
    return (
      // 路由配置
      <HistoryRouter history={history}>
        <div className="App">
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
              {/* 创建路由path和组件的关系 */}
              {/* Layout需要鉴权处理 */}
              <Route path='login' element={<Login />}></Route>
              {/* 这里的Layout一定不能写死 要根据是否登陆进行判断 */}
              {/* <Route path='/' element={
                <AuthComponent>
                  <GeekLayout />
                </AuthComponent>
              }>
                <Route index element={<Home />}></Route>
                <Route path='article' element={<Article />}></Route>
                <Route path='publish' element={<Publish />}></Route>
              </Route> */}
            </Routes>
          </Suspense>
        </div>
      </HistoryRouter>
    )
  }
}
