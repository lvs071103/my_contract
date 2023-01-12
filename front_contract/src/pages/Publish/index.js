import React from 'react'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Input,
  Upload,
  Space,
  Select,
  message,
  DatePicker,
  Radio
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { getToken, http } from '@/utils'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import moment from "moment"
import { useState } from 'react'
// import { observer } from 'mobx-react-lite'
import { flushSync } from 'react-dom'
import { useStore } from '@/store'


const { TextArea } = Input
const { Option } = Select
const { Dragger } = Upload

export default function Publish () {

  const [params] = useSearchParams()
  const contractId = params.get('contractId')

  // 获取合作伙伴和文本类型
  const { suppliersStore, categoryStore } = useStore()

  // 定义上传文件列表
  const [fileList, setFileList] = useState([])
  // 定义单选框初始值
  const [value, setValue] = useState(0)

  const props = {
    label: '附件',
    name: 'doc_file',
    multiple: true,
    action: 'http://10.1.32.152:8000/api/contract/attachments/upload',
    headers: { Authorization: `Bearer ${getToken()}` },
    onChange (info) {
      const { status } = info.file
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList)
      }
      // 上传成功
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        // 上传失败
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
      flushSync(() => {
        setFileList(info.fileList)
      })
      // 移除文件
      if (status === 'removed') {
        const removed = async () => {
          await http.post(`contract/attachments/delete/${info.file.response.pk}`)
        }
        removed()
      }
      flushSync(() => { setFileList(info.fileList) })
    },

    onDrop (e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const normFile = (e) => {
    console.log(fileList)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  // 初始化useNaviage
  const navigate = useNavigate()

  // 提交表单
  const onFinish = async (values) => {
    const {
      contract_sn,
      name,
      categories,
      suppliers,
      owner,
      price,
      dragger,
      start_date,
      end_date,
      purpose,
      status } = values
    const params = {
      contract_sn,
      name,
      categories,
      suppliers,
      owner,
      price,
      start_date: start_date.format('YYYY-MM-DD'),
      end_date: end_date.format('YYYY-MM-DD'),
      dragger,
      purpose,
      status
    }
    // 新增合同接口
    if (contractId) {
      await http.post(`contract/contract/edit/${contractId}`, params)
    } else {
      await http.post('contract/contract/publish', params)
    }
    // 跳转至合同列表
    navigate('/contract/contract/list')
    message.success('提交成功')
  }

  // 编辑并回填数据
  const formRef = React.createRef()
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`contract/contract/detail/${contractId}`)
      const { fileList, data } = res.data
      formRef.current.setFieldsValue({
        contract_sn: data.contract_sn,
        name: data.name,
        owner: data.owner,
        price: data.price,
        categories: data.categories.id,
        suppliers: data.suppliers.id,
        start_date: moment(data.start_date),
        end_date: moment(data.end_date),
        status: data.status ? 1 : 0,
        purpose: data.purpose,
        dragger: fileList,
      })
    }
    if (contractId) {
      loadDetail()
    }
  }, // eslint-disable-next-line
    [contractId])

  const radioOnChange = (e) => {
    // console.log('radio checked', e.target.value)
    setValue(e.target.value)
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
          ref={formRef}
          onFinish={onFinish}
          initialValues={{
            'status': value,
          }}
        >
          <Form.Item
            label="合同编号"
            name="contract_sn"
            rules={[{ required: true, message: '合同编号' }]}
          >
            <Input placeholder="请输入合同编号" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="合同名称"
            name="name"
            rules={[{ required: true, message: '请输入唯一合同名称' }]}
          >
            <Input placeholder="请输入合同名称" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="文本类型"
            name="categories"
            rules={[{ required: true, message: '请选择文本类型' }]}
          >
            <Select placeholder="请选择文本类型" style={{ width: 400 }}>
              {categoryStore.categoryList.map(item => (
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
            label="合同价格"
            name="price"
            rules={[{ required: true, message: '请输入该合同的价格' }]}
          >
            <Input type='number'
              placeholder="请输入该合同的价格"
              style={{ width: 400 }}
              prefix="￥" suffix="RMB"
              disabled={contractId ? true : false}
            />
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
            name="start_date"
            label="合同开始时间"
          >
            <DatePicker
              // showTime
              format="YYYY-MM-DD"
              locale={locale}
            />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="合同终止时间"
          >
            <DatePicker
              // showTime
              format="YYYY-MM-DD"
              locale={locale}
            />
          </Form.Item>

          <Form.Item
            label="用途"
            name="purpose"
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
          >
            <Radio.Group onChange={radioOnChange}>
              <Radio value={0}> 履约中 </Radio>
              <Radio value={1}> 完成 </Radio>
            </Radio.Group>
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