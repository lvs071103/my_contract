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
// import { observer } from 'mobx-react-lite'

const { Header, Sider } = Layout

const GeekLayout = () => {

  const { pathname } = useLocation()
  // const [openKey, setOpenKey] = useState('/')
  // const [collapsed, setCollapsed] = useState(true)
  // pathname：url中的子路径

  const { userStore, loginStore, permsStore, groupStore, typesStore } = useStore()
  // 获取用户数据
  useEffect(() => {
    try {
      userStore.getUserInfo()
      permsStore.loadPermslList()
      groupStore.loadGroupList()
      typesStore.loadTypeList()
    } catch { }
    // getSubMenu()
  }, [userStore, permsStore, groupStore, typesStore])

  const items = [
    getItem(<Link to={'/'}>数据概览</Link>, '/', <DashboardFilled />),
    getItem('用户管理', 'sub1', <TeamOutlined />,
      [
        getItem(<Link to={'/accounts/group/list'}>用户组</Link>, '/accounts/group/list'),
        getItem(<Link to={'/accounts/user/list'}>用户</Link>, '/accounts/user/list'),
      ]),
    getItem('合同管理', 'sub2', <EditOutlined />,
      [
        getItem(<Link to={'/contract/supplier/list'}>供应商</Link>, '/contract/supplier/list'),
        getItem(<Link to={'/contract/contract/list'}>合同列表</Link>, '/contract/contract/list'),
        getItem(<Link to={'/contract/contract/add'}>提交表单</Link>, '/contract/contract/add'),
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
            defaultSelectedKeys={[pathname]}
            // 高亮原理： selectedKeys === item key
            selectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            // inlineCollapsed={collapsed}
            defaultOpenKeys={() => {
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
              return list
            }
            }
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

// export default observer(GeekLayout)
export default GeekLayout