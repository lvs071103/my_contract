import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Card, Breadcrumb, Button, Space, Popconfirm, Tag, Input } from 'antd'
import 'moment/locale/zh-cn'
// import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
// import { useStore } from '@/store'
import { http } from '@/utils'
// import img404 from '@/assets/error.png'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'


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

  // 如果异步请求函数需要依赖一些数据的变化而重新执行
  // 推荐把它写在内部
  // 统一不抽离函数到外面 只要涉及到异步请求的函数 都放到useEffect内部
  // 本质区别：写到外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
  // 而写到useEffect中，只会在依赖项发生变化的时候 函数才会进行重新初始化
  // 避免性能损失

  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('accounts/user/list', { params })
      // console.log("response: ", res.data)
      const { data, count } = res.data
      // console.log(count)
      setUsers({
        list: data,
        count: count,
      })
    }
    loadList()
  }, [params])


  // 切换当前页触发
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  // 删除
  const delArticle = async (data) => {
    // console.log(data)
    await http.delete(`/mp/articles/${data.id}`)
    // 刷新一下列表
    setParams({
      ...params,
      page: 1
    })
  }

  // 编辑
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
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
      render: data => <Tag color="green">是</Tag>
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      render: data => <Tag color="green">激活</Tag>
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
              onClick={() => goPublish(data)}
            />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              // onClick={() => delArticle(data)}
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
          <Button type="primary">Add</Button>
        }

        extra={
          <Search placeholder="input search text" onSearch='' enterButton />
        }
        style={{

        }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users.list}
          pagination={
            {
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

export default observer(User)