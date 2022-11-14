import React, { useEffect, useState } from 'react'
import { Table, Card, Breadcrumb, Button, Space, Popconfirm, Tag, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { http } from '@/utils'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'



const { Search } = Input

const Group = () => {

  const [groups, setGroups] = useState({
    list: [], //组列表
    count: 0 // 组数量
  })

  // 分页参数管理
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10
  })

  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('accounts/group/list', { params })
      // console.log("response: ", res.data)
      const { data, count } = res.data
      // console.log(count)
      setGroups({
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
      title: '用户组名',
      dataIndex: 'name',
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
          <Breadcrumb.Item>用户组</Breadcrumb.Item>
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
          dataSource={groups.list}
          pagination={
            {
              pageSize: params.pageSize,
              total: groups.count,
              onChange: pageChange
            }
          }
        />
      </Card>

    </div>
  )
}

export default observer(Group)
