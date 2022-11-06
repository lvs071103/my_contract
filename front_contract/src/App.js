import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import AuthRoute from './components/AuthRoute'
import './index.scss'

export default class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Routes>
          {/* 创建路由path和组件对应关系 */}
          {/* Layout需要鉴权处理 */}
          <Route path='/' element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }></Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    )
  }
}
