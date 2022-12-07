import React, { useEffect, useState } from 'react'
import { Table, Tag, Card, Space, Breadcrumb, Form, Button, Radio, DatePicker, Select, Popconfirm } from 'antd'
import { http } from '@/utils'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { useStore } from '@/store'
import { Link, useNavigate } from 'react-router-dom'


const { Option } = Select
const { RangePicker } = DatePicker

export default function Contract () {
  // 频道列表管理移入store中
  const { typesStore } = useStore()
  // 频道列表管理
  // const [channelList, setChannelList] = useState([])
  // const loadChannelList = async () => {
  //   const res = await http.get('/channels')
  //   setChannelList(res.data.channels)
  // }
  // useEffect(() => {
  //   loadChannelList()
  // }, [])

  // 文章列表管理 统一管理数据 将来修入给setList传对象
  const [contracts, setContracts] = useState({
    list: [], //文章列表
    count: 0 // 文章数量
  })

  // 文章参数管理
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    // status: 0
  })
  // 如果异步请求函数需要依赖一些数据的变化而重新执行
  // 推荐把它写在内部
  // 统一不抽离函数到外面 只要涉及到异步请求的函数 都放到useEffect内部
  // 本质区别：写到外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
  // 而写到useEffect中，只会在依赖项发生变化的时候 函数才会进行重新初始化
  // 避免性能损失
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/contract/contract/list', { params })
      console.log(res)
      const { data, count } = res.data
      setContracts({
        list: data,
        count: count,
      })
    }
    loadList()
  }, [params])

  const onFinish = (values) => {
    console.log(values)
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
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  // 删除

  const delArticle = async (data) => {
    console.log(data)
    await http.delete(`/contract/contracts/${data.id}`)
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
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0]} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
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
            <Breadcrumb.Item>合同管理</Breadcrumb.Item>
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
              <Radio value={0}>InProgress</Radio>
              <Radio value={1}>Done</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="分类" name="type_id">
            <Select
              placeholder="请选择类型"
              // defaultValue="lucy"
              style={{ width: 120 }}
            >
              {typesStore.typeList.map(channel => (
                <Option value={channel.id} key={channel.id}>{channel.name}</Option>
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
      <Card title={`根据筛选条件共查询到 ${contracts.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={contracts.list}
          pagination={
            {
              pageSize: params.pageSize,
              total: contracts.count,
              onChange: pageChange
            }
          }
        />
      </Card>
    </div>
  )
}
