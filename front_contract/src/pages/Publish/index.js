import React, { useRef, useState } from 'react'
import { Card, Breadcrumb, Form, Button, Input, Upload, Space, Select, message, DatePicker } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { getToken, http } from '@/utils'
import { useStore } from '@/store'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'

const { TextArea } = Input
const { Option } = Select
const { Dragger } = Upload

export default function Publish () {

  // 存放上传图片的列表
  const [fileList, setFileList] = useState([])
  // 切换图片类型
  const [attachments, setAttachments] = useState(1)

  // 使用useRef声明一个暂存仓库
  const cacheFileList = useRef()


  const { typesStore, suppliersStore } = useStore()

  const props = {
    label: '附件',
    name: 'doc_file',
    multiple: true,
    action: 'http://localhost:8000/api/contract/attachments/upload',
    headers: { Authorization: `Bearer ${getToken()}` },
    onChange (info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop (e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const normFile = (e) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  // 初始化useNaviage
  const navigate = useNavigate()

  // 提交表单
  const onFinish = async (values) => {
    console.log(values)
    // 数据的二次处理 重点处理cover字段
    const { name, types, suppliers, owner, dragger, start_datetime, end_datetime, purpose } = values
    const params = {
      name,
      types,
      suppliers,
      owner,
      start_datetime: start_datetime.format('YYYY-MM-DD HH:mm:ss'),
      end_datetime: end_datetime.format('YYYY-MM-DD HH:mm:ss'),
      dragger,
      purpose,
    }
    console.log(params)
    // 新增合同接口
    const res = await http.post('contract/contract/add', params)
    console.log(res)
    // 跳转 提示用户
    navigate('/contract/contract/list')
    message.success('提交成功')
  }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{'提交'}合同</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          onFinish={onFinish}
        >
          <Form.Item
            label="合同名称"
            name="name"
            rules={[{ required: true, message: '请输入唯一合同名称' }]}
          >
            <Input placeholder="请输入合同名称" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="文本类型"
            name="types"
            rules={[{ required: true, message: '请选择文本类型' }]}
          >
            <Select placeholder="请选择文本类型" style={{ width: 400 }}>
              {typesStore.typeList.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}

            </Select>
          </Form.Item>

          <Form.Item
            label="合作伙伴"
            name="suppliers"
            rules={[{ required: true, message: '请选择供合作伙伴' }]}
          >
            <Select placeholder="请选择合作伙伴" style={{ width: 400 }}>
              {suppliersStore.supplierList.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="项目经理"
            name="owner"
            rules={[{ required: true, message: '请输入该合同的负责人或对接人' }]}
          >
            <Input placeholder="请输入该合同的负责人或对接人" style={{ width: 400 }} />
          </Form.Item>

          <Form.Item label="附件">
            <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                  band files
                </p>
              </Dragger>
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="start_datetime"
            label="合同开始时间"
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              locale={locale}
            />
          </Form.Item>

          <Form.Item
            name="end_datetime"
            label="合同终止时间"
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              locale={locale}
            />
          </Form.Item>

          <Form.Item
            label="用途"
            name="purpose"
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
