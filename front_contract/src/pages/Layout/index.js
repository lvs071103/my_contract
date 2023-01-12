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
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

const { Header, Sider } = Layout

const rootSubmenuKeys = ['/', 'sub1', 'sub2']

const GeekLayout = () => {

  const { pathname } = useLocation()
  const [openKeys, setOpenKeys] = useState(['/'])
  // const [collapsed, setCollapsed] = useState(false)
  // pathname：url中的子路径

  const { userStore, loginStore, permsStore, groupStore, suppliersStore, categoryStore } = useStore()
  // 获取用户数据
  useEffect(() => {
    try {
      userStore.getUserInfo()
      permsStore.loadPermslList()
      groupStore.loadGroupList()
      suppliersStore.loadSupplierList()
      categoryStore.loadCategoryList()
    } catch { }
    // 刷新页面获取子菜单
    const getSubKeys = () => {
      const list = []
      items.map((item) => {
        if (item.children) {
          item.children.map((s) => {
            if (s.key === pathname) {
              list.push(item.key)
            }
            return {}
          })
        }
        return {}
      })
      setOpenKeys(list)
    }
    getSubKeys()
  }, // eslint-disable-next-line
    [userStore, permsStore, groupStore])

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  const items = [
    getItem(<Link to={'/'}>数据概览</Link>, '/', <DashboardFilled />),
    getItem('用户管理', 'sub1', <TeamOutlined />,
      [
        getItem(<Link to={'/accounts/group/list'}>用户组</Link>, '/accounts/group/list'),
        getItem(<Link to={'/accounts/user/list'}>用户</Link>, '/accounts/user/list'),
      ]),
    getItem('合同管理', 'sub2', <EditOutlined />,
      [
        getItem(<Link to={'/contract/category/list'}>合同分类</Link>, '/contract/category/list'),
        getItem(<Link to={'/contract/supplier/list'}>合作伙伴</Link>, '/contract/supplier/list'),
        getItem(<Link to={'/contract/contract/list'}>合同列表</Link>, '/contract/contract/list'),
        getItem(<Link to={'/contract/contract/publish'}>提交表单</Link>, '/contract/contract/publish'),
      ]),
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
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            items={items}
          >
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout >
  )
}

export default observer(GeekLayout)
// export default GeekLayout