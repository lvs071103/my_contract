import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Card, Breadcrumb, Button, Space, Popconfirm, Tag, Input, Modal } from 'antd'
import 'moment/locale/zh-cn'
import './index.scss'
import { http } from '@/utils'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
// import { observer } from 'mobx-react-lite'
import UserForm from './user.Form'


const { Search } = Input

const User = () => {

  // 用户列表管理 统一管理数据 将来修入给setList传对象
  const [users, setUsers] = useState({
    list: [], //用户列表
    count: 0 // 用户数量
  })

  // 分页参数管理
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [row, setRow] = useState({})

  // 如果异步请求函数需要依赖一些数据的变化而重新执行
  // 推荐把它写在内部
  // 统一不抽离函数到外面 只要涉及到异步请求的函数 都放到useEffect内部
  // 本质区别：写到外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
  // 而写到useEffect中，只会在依赖项发生变化的时候 函数才会进行重新初始化
  // 避免性能损失

  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('accounts/user/list', { params })
      const { data, count } = res.data
      setUsers({
        list: data,
        count: count,
      })
    }
    loadList()
  }, [params])


  // 弹出添加窗口
  const showAddModal = () => {
    setTitle('添加')
    setIsModalOpen(true)
  }

  // 切换当前页触发
  const pageChange = (page, newPageSize) => {
    setParams({
      ...params,
      page: params.pageSize !== newPageSize ? 1 : page,
      pageSize: newPageSize
    })
  }

  // 删除
  const delUser = async (data, page) => {
    // console.log(data)
    await http.delete(`accounts/user/delete/${data.id}`)
    // 刷新一下列表
    setParams({
      ...params,
      page
    })
  }

  // 编辑
  const goUpdate = (data) => {
    setTitle('编辑')
    setIsModalOpen(true)
    setRow(data)
  }

  const handleOk = async () => {
    // 关闭弹窗，并更新users
    setIsModalOpen(false)
    const res = await http.get('accounts/user/list', { params })
    const { data, count } = res.data
    setUsers(
      {
        list: data,
        count: count
      }
    )
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '加入时间',
      dataIndex: 'date_joined'
    },
    {
      title: '最近登陆',
      dataIndex: 'last_login'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '管理员',
      dataIndex: 'is_superuser',
      render: (text, _) => {
        return `${text}` === 'true' ?
          <Tag color="green">是</Tag> :
          <Tag color="yellow">否</Tag>
      }
    },
    {
      title: '员工',
      dataIndex: 'is_staff',
      render: (text, _) => {
        return `${text}` === 'true' ?
          <Tag color="green">是</Tag> :
          <Tag color="yellow">否</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      render: (text, _) => {
        return `${text}` === 'true' ?
          <Tag color="green">激活</Tag> :
          <Tag color="yellow">未激活</Tag>
      }
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goUpdate(data)}
            />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delUser(data, params.page)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>

          </Space>
        )
      }
    }
  ]

  return (
    <div>
      {/* 简介 */}
      <Card
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item>用户列表</Breadcrumb.Item>
        </Breadcrumb>
      </Card>

      <Card
        title={
          <Button type="primary" onClick={showAddModal}>Add</Button>
        }

        extra={
          <Search placeholder="input search text" onSearch='' enterButton />
        }
        style={{

        }}
      >
        <Modal
          title={title}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={860}
          centered
        >
          <UserForm
            handleOk={handleOk}
            id={title === '编辑' ? row.id : null}
          />
        </Modal>
        <Table
          rowKey={row => (row.id)}
          columns={columns}
          dataSource={users.list}
          pagination={
            {
              defaultCurrent: params.page,
              pageSize: params.pageSize,
              total: users.count,
              onChange: pageChange
            }
          }
        />
      </Card>

    </div>
  )
}

// export default observer(User)
export default User