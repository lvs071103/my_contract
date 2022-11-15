import { Layout, Menu, Popconfirm } from 'antd'
import {
  DashboardFilled,
  TeamOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

const { Header, Sider } = Layout

const GeekLayout = () => {

  const { pathname } = useLocation()

  // console.log(pathname)

  const { userStore, loginStore, channelStore, groupStore } = useStore()
  // 获取用户数据
  useEffect(() => {
    try {
      userStore.getUserInfo()
      channelStore.loadChannelList()
      groupStore.loadGroupList()
    } catch { }
  }, [userStore, channelStore, groupStore])

  const items = [
    getItem(<Link to={'/'}>数据概览</Link>, '/', <DashboardFilled />),
    getItem(<Link to={'#'}>用户管理</Link>, 'parent-1', <TeamOutlined />,
      [
        getItem(<Link to={'/accounts/group/list'}>用户组</Link>, '/accounts/group/list'),
        getItem(<Link to={'/accounts/user/list'}>用户</Link>, '/accounts/user/list'),
      ]),
    getItem(<Link to={'/contract'}>合同管理</Link>, '/contract', <EditOutlined />)
  ]

  function getItem (label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    }
  }

  // 确定退出
  const navigate = useNavigate()
  const onLogout = () => {
    // 退出登陆 删除token 跳回到登录
    loginStore.loginOut()
    navigate('/login/')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.username}</span>
          <span className="user-logout">
            <Popconfirm
              onConfirm={onLogout}
              title="是否确认退出？"
              okText="退出"
              cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[pathname]}
            // 高亮原理： selectedKeys === item key
            selectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          >
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)
// export default GeekLayout