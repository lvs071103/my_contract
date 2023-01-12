import React, { useEffect, useState } from 'react'
import {
  Table,
  Tag,
  Card,
  Space,
  Breadcrumb,
  Form,
  Button,
  Radio,
  // DatePicker,
  Select,
  Popconfirm,
  Drawer
} from 'antd'
import { http } from '@/utils'
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
import 'moment/locale/zh-cn'
// import locale from 'antd/es/date-picker/locale/zh_CN'
import { Link, useNavigate } from 'react-router-dom'
import Detail from './detail'
import { useStore } from '@/store'
// import { observer } from 'mobx-react-lite'


const { Option } = Select
// const { RangePicker } = DatePicker

function Contract () {

  const { categoryStore, suppliersStore } = useStore()
  const [value, setValue] = useState(0)
  const [contracts, setContracts] = useState({
    list: [], //合同列表
    count: 0 // 合同数量
  })

  // 合同参数管理
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
      const res = await http.get('contract/contract/list', { params })
      const { data, count } = res.data
      setContracts({
        list: data,
        count: count,
      })
    }
    loadList()
  }, // eslint-disable-next-line
    [params])

  const onFinish = (values) => {
    console.log(values)
    const { categories, suppliers, status } = values
    //数据处理
    const _params = {}
    _params.status = status
    if (categories) {
      _params.categories = categories
    }
    if (suppliers) {
      _params.suppliers = suppliers
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

  const delContract = async (data) => {
    // console.log(data)
    await http.delete(`contract/contract/delete/${data.id}`)
    // 刷新一下列表
    setParams({
      ...params,
      page: params.page
    })
  }

  // 编辑
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/contract/contract/publish?contractId=${data.id}`)
  }
  // 详情

  const [open, setOpen] = useState(false)
  const [row, setRow] = useState({})

  const onClose = () => {
    setOpen(false)
  }

  const showDetail = (data) => {
    setOpen(true)
    setRow(data)
  }

  const radioOnChange = (e) => {
    setValue(e.target.value)
  }

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contract_sn',
    },
    {
      title: '合同名',
      dataIndex: 'name',
      width: 220
    },
    {
      title: '类型',
      dataIndex: 'categories',
      render: (text, _) => {
        return text ? text.name : <Tag color="red">未指定</Tag>
      }
    },
    {
      title: '合同签定时间',
      dataIndex: 'start_date'
    },
    {
      title: '合同截止时间',
      dataIndex: 'end_date'
    },
    {
      title: '负责人',
      dataIndex: 'owner'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, _) => {
        return text === true ?
          <Tag color="blue">已完成</Tag> :
          <Tag color="green">履约中...</Tag>
      }
    },
    {
      title: '供应商',
      dataIndex: 'suppliers',
      render: (text, _) => {
        return text ? text.name : <Tag color="red">未指定</Tag>
      }
    },
    {
      title: '用途',
      dataIndex: 'purpose',
      width: 300
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
              onConfirm={() => delContract(data)}
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

            <Button
              type="primary"
              ghost
              shape="circle"
              icon={<UnorderedListOutlined />}
              onClick={() => { showDetail(data) }}
            />

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
          initialValues={{ status: value }}>
          <Form.Item label="状态" name="status">
            <Radio.Group onChange={radioOnChange}>
              <Radio value={0}>履约中</Radio>
              <Radio value={1}>已完成</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="合同分类"
            name="categories"
          // rules={[{ required: true, message: '选择合同分类' }]}
          >
            <Select
              placeholder="请选择合同分类"
              // defaultValue="lucy"
              style={{ width: 200 }}
            >
              {categoryStore.categoryList.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="合作伙伴"
            name="suppliers"
          // rules={[{ required: true, message: '选择合作伙伴' }]}
          >
            {/* 传入locale属性 控制中文显示*/}
            {/* <RangePicker locale={locale}></RangePicker> */}
            <Select
              placeholder="请选择合作伙伴"
              // defaultValue="lucy"
              style={{ width: 300 }}
            >
              {suppliersStore.supplierList.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </Select>
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
          rowKey={row => (row.id)}
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
      <Drawer
        title="详情"
        placement="right"
        size='large'
        open={open}
        onClose={onClose}
      >
        <Detail id={row.id} />
      </Drawer>
    </div>
  )
}

// export default observer(Contract)
export default Contract