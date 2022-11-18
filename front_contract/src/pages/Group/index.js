import React, { useEffect, useState } from 'react'
import { Table, Card, Breadcrumb, Button, Space, Popconfirm, Input, Modal } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { http } from '@/utils'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import GroupForm from './group.From'
import './index.scss'



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

  // 初始化组权限
  const [permissions, setPermissions] = useState({
    list: [],
  })

  useEffect(() => {
    const loadList = async () => {
      const res1 = await http.get('accounts/group/list', { params })
      const res2 = await http.get('accounts/permission/list')
      // console.log("response: ", res.data)
      const { groups, count } = res1.data
      const { permissions } = res2.data
      setGroups({
        list: groups,
        count: count,
      })
      setPermissions({
        list: permissions
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
  const delGroup = async (data, page) => {
    await http.delete(`/accounts/group/delete/${data.id}`)
    // 刷新一下列表
    setParams({
      ...params,
      page
    })
  }

  // 编辑
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    // 关闭弹窗，并更新Groups
    setIsModalOpen(false)
    const res = await http.get('accounts/group/list', { params })
    const { groups, count } = res.data
    setGroups({
      list: groups,
      count: count,
    })
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
              onConfirm={() => delGroup(data, params.page)}
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
          <Button type="primary" onClick={showModal}>Add</Button>
        }

        extra={
          <Search placeholder="input search text" onSearch='' enterButton />
        }
      >
        <Modal
          title="添加"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          wrapClassName="vertical-center-modal"
          width={860}
        >
          <GroupForm
            handleOk={handleOk}
            onCancel={handleCancel}
            setGroups={setGroups}
            permissions={permissions.list} />
        </Modal>
        <Table
          rowKey={(record) => {
            return (record.id)
          }}
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
