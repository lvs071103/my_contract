import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Card, Breadcrumb, Form, Button, Space, Popconfirm, Tag, Radio, Select, DatePicker } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { useStore } from '@/store'
import { http } from '@/utils'
// import img404 from '@/assets/error.png'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'


const { Option } = Select
const { RangePicker } = DatePicker

export default function Contract () {

  const { channelStore } = useStore()

  const onFinish = (values) => {
    const { channel_id, date, status } = values
    //数据处理
    const _params = {}
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // 修改params数据， 引起接口重新发送，对象的合并是一个整体覆盖，改了对像的整体引用
    // setParams(params)
    setParams({
      ...params,
      ..._params
    })

  }

  // 用户列表管理 统一管理数据 将来修入给setList传对象
  const [users, setUsers] = useState({
    list: [], //用户列表
    count: 0 // 用户数量
  })

  // 分页参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
  })

  // 如果异步请求函数需要依赖一些数据的变化而重新执行
  // 推荐把它写在内部
  // 统一不抽离函数到外面 只要涉及到异步请求的函数 都放到useEffect内部
  // 本质区别：写到外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
  // 而写到useEffect中，只会在依赖项发生变化的时候 函数才会进行重新初始化
  // 避免性能损失
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/user/list', { params })
      // console.log("response: ", res.data)
      const { data, count } = res.data
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
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onFinish}
          initialValues={{ status: -1 }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>非激活</Radio>
              <Radio value={1}>激活</Radio>
              <Radio value={2}>管理员</Radio>
              <Radio value={3}>员工</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="用户组" name="group_id">
            <Select
              placeholder="请选择用户组"
              style={{ width: 120 }}
            >
              {channelStore.channelList.map(group => (
                <Option value={group.id} key={group.id}>{group.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区域 */}
      <Card title={`根据筛选条件共查询到 ${users.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users.list}
          pagination={
            {
              pageSize: params.per_page,
              total: users.count,
              onChange: pageChange
            }
          }
        />
      </Card>
    </div>
  )
}
