import React, { useEffect, useState } from 'react'
import { Table, Card, Breadcrumb, Button, Space, Popconfirm, Input, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { http } from '@/utils'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import './index.scss'
import GroupForm from './group.From'
import GroupEdit from './group.Edit'



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
  const [permissions, setPermissions] = useState([])

  const [title, setTitle] = useState('')

  const [cursor, setCursor] = useState({
    id: 0,
    name: ''
  })
  const [selected, setSelected] = useState([])

  useEffect(() => {
    const loadList = async () => {
      const res1 = await http.get('accounts/group/list', { params })
      const res2 = await http.get('accounts/permission/list')
      const { groups, count } = res1.data
      const { permissions } = res2.data
      setGroups({
        list: groups,
        count: count,
      })
      setPermissions(permissions)
    }
    loadList()
  }, [params])


  // 切换当前页或者调整每页显示数量
  const pageChange = (page, newPageSize) => {
    setParams({
      ...params,
      page: params.pageSize !== newPageSize ? 1 : page,
      pageSize: newPageSize
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

  const [isModalOpen, setIsModalOpen] = useState(false)

  // 弹出添加窗口
  const showAddModal = () => {
    setTitle('添加')
    setIsModalOpen(true)
  }

  // 弹出编辑窗口
  const showEditModal = (data) => {
    setTitle('编辑')
    setIsModalOpen(true)
    setCursor(
      {
        id: data.id,
        name: data.name
      }
    )
    setSelected(data.permissions)
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
      title: '权限',
      key: 'permissions',
      dataIndex: 'permissions',
      // 调整列宽，超出部分隐藏并用...显示
      onCell: () => {
        return {
          style: {
            maxWidth: 160,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      // 显示一列数组值的显示
      render: (_, record) => (
        <>
          {record.permissions.map((item) => {
            return (
              <span key={item.id}> {item.name} </span>
            )
          })}
        </>
      )
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
              onClick={() => { showEditModal(data) }}
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
          <Button type="primary" onClick={showAddModal}>Add</Button>
        }

        extra={
          <Search placeholder="input search text" onSearch='' enterButton />
        }
      >
        <Modal
          title={title}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          permissions={permissions}
          width={860}
          centered
        >
          {title === '添加' ? <GroupForm
            handleOk={handleOk}
            onCancel={handleCancel}
            setGroups={setGroups}
            permissions={permissions} /> : <GroupEdit
            cursor={cursor}
            permissions={permissions}
            selected={selected}
          />}
        </Modal>
        <Table
          rowKey={(record) => {
            return (record.id)
          }}
          columns={columns}
          dataSource={groups.list}
          pagination={
            {
              defaultCurrent: params.page,
              pageSize: params.pageSize,
              total: groups.count,
              onChange: pageChange,
              className: "pagination",
            }
          }
        />
      </Card>

    </div>
  )
}

export default observer(Group)
