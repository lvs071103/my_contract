import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Card, Breadcrumb, Button, Space, Popconfirm, Input, Modal } from 'antd'
import 'moment/locale/zh-cn'
import { http } from '@/utils'
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useStore } from '@/store'
import CategoryForm from './form'

const { Search } = Input

export default function Category () {

  const { categoryStore } = useStore()

  // 分页参数管理
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10
  })

  // 用户列表管理 统一管理数据 将来修入给setList传对象
  const [categories, setCategories] = useState({
    list: [], //用户列表
    count: 0 // 用户数量
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
      const res = await http.get('contract/category/list', { params })
      const { data, count } = res.data
      setCategories({
        list: data,
        count: count,
      })
    }
    loadList()
  }, // eslint-disable-next-line
    [params])


  // 弹出添加窗口
  const showAddModal = () => {
    setTitle('添加')
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    // 关闭弹窗，并更新suppliers
    setIsModalOpen(false)
    const res = await http.get('contract/category/list', { params })
    const { data, count } = res.data
    setCategories(
      {
        list: data,
        count: count
      }
    )
    try {
      categoryStore.loadCategoryList()
    } catch { }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // 搜索
  const onSearch = async (data) => {
    const res = await http.get(`contract/supplier/search/?q=${data}`)
    console.log(res)
    setCategories({
      list: res.data.suppliers,
      count: res.count
    })
  }

  //弹出详情窗口
  const showDetailModal = (data) => {
    setTitle('详情')
    setIsModalOpen(true)
    setRow(data)
  }

  // 切换当前页触发
  const pageChange = (page, newPageSize) => {
    setParams({
      ...params,
      page: params.pageSize !== newPageSize ? 1 : page,
      pageSize: newPageSize
    })
  }

  // 编辑
  const goUpdate = (data) => {
    setTitle('编辑')
    setIsModalOpen(true)
    setRow(data)
  }

  // 删除
  const delCategory = async (data, page) => {
    // console.log(data)
    await http.delete(`contract/category/delete/${data.id}`)
    // 刷新一下列表
    setParams({
      ...params,
      page
    })
  }


  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc'
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
              title="确认删除该条记录吗?"
              onConfirm={() => delCategory(data, params.page)}
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
            <Button
              type="primary"
              ghost
              shape="circle"
              icon={<UnorderedListOutlined />}
              onClick={() => { showDetailModal(data) }}
            />
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
          <Breadcrumb.Item>合同管理</Breadcrumb.Item>
          <Breadcrumb.Item>供应商列表</Breadcrumb.Item>
        </Breadcrumb>
      </Card>

      <Card
        title={
          <Button type="primary" onClick={showAddModal}>Add</Button>
        }

        extra={
          <Search placeholder="input search text" onSearch={onSearch} enterButton />
        }
      >
        <Modal
          title={title}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={860}
          centered
        >
          <CategoryForm
            handleOk={handleOk}
            title={title}
            id={title === '编辑' || title === '详情' ? row.id : null}
          />
        </Modal>
        <Table
          rowKey={row => (row.id)}
          columns={columns}
          dataSource={categories.list}
          pagination={
            {
              defaultCurrent: params.page,
              pageSize: params.pageSize,
              total: categories.count,
              onChange: pageChange
            }
          }
        />
      </Card>

    </div>
  )
}
