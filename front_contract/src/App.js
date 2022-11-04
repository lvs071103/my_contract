import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import './index.scss'

export default class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Routes>
          {/* 创建路由path和组件对应关系 */}
          <Route path='/' element={<Layout />}></Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    )
  }
}
