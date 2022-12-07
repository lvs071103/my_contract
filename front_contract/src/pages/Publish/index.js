import React, { useEffect, useRef, useState } from 'react'
import { Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, Select, message, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { http } from '@/utils'
import { useStore } from '@/store'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'

const { TextArea } = Input
const { Option } = Select

export default function Publish () {
  const { typesStore } = useStore()
  // 存放上传图片的列表
  const [fileList, setFileList] = useState()

  // 使用useRef声明一个暂存仓库
  const cacheImageList = useRef()

  // 上传
  const onUploadChange = info => {
    const fileList = info.fileList.map(file => {
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      // 上传中时， 不做处理
      return file
    })
    console.log(fileList)
    // 采取受控的写法：在最后一次log里面有response
    // 最终react state fileList中存放的数据有response.data.url
    setFileList(fileList)
    cacheImageList.current = fileList
  }
  // 切换图片类型
  const [fileCount, setFileCount] = useState(1)

  const radioChange = (e) => {
    console.log(e.target.value)
    // 使用原始数据作为判断条件 不采取经过useState方法修改之后的数据
    // useState修改之后的数据 无法同步获取修改之后的新值
    const rawValue = e.target.value
    setFileCount(rawValue)
    // 从仓库里面取对应的图片数量，用来渲染图片列表的fileList
    // 通过调用setFileList
    if (rawValue === 1) {
      const img = cacheImageList.current ? cacheImageList.current[0] : []
      setFileList([img])
    } else if (rawValue === 3) {
      setFileList(cacheImageList.current)
    }
  }

  // 初始化useNaviage
  const navigate = useNavigate()

  // 提交表单
  const onFinish = async (values) => {
    console.log(values)
    // 数据的二次处理 重点处理cover字段
    const { channel_id, content, title, type } = values
    console.log(content)
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if (articleId) {
      // 请求编辑接口
      await http.put(`/mp/articles/${articleId}?draft=false`, params)
    } else {
      // 新增接口
      await http.post('/mp/articles?draft=false', params)
    }
    // 跳转 提示用户
    navigate('/contract/contract/list')
    message.success(`${articleId ? '更新成功' : '发布成功'}`)
  }

  // 编辑功能
  const [params] = useSearchParams()
  const articleId = params.get('id')
  // console.log('route: ', articleId)
  // 数据回填 id调用接口， 1.表单回填 2.暂存列表 3.upload组件fileList需要回填
  const form = useRef(null)
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/contract/contract/detail/${articleId}`)
      // console.log(res)
      // 表单数据回填 实例方法
      const { cover, ...formValue } = res.data
      form.current.setFieldsValue({ ...formValue, type: cover.type })
      // 调用setFileList方法回填upload
      const imageList = cover.images.map(url => ({ url }))
      setFileList(imageList)
      setFileCount(cover.type)
      // 暂存列表
      cacheImageList.current = imageList
    }
    // 必须是编辑状态 教程可以发送请求
    if (articleId) {
      loadDetail()
      // console.log(form.current)
    }
  }, [articleId])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{articleId ? '编辑' : '提交'}合同</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="合同名称"
            name="name"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="合同类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型" style={{ width: 400 }}>
              {typesStore.typeList.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}

            </Select>
          </Form.Item>

          <Form.Item
            label="合作伙伴"
            name="suppliers"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <Select placeholder="请选择类型" style={{ width: 400 }}>
              {/* {channelStore.channelList.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))} */}

            </Select>
          </Form.Item>

          <Form.Item
            label="项目负责人"
            name="owner"
            style={{ width: 400 }}
          >
            <Input />
          </Form.Item>


          <Form.Item label="附件">
            <Form.Item name="attrs">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单附件</Radio>
                <Radio value={3}>三附件</Radio>
                <Radio value={0}>无附件</Radio>
              </Radio.Group>
            </Form.Item>
            {fileCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://contract/attachments/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={fileCount > 1}
                maxCount={fileCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          {/* 这里是富文本组件 已经被Form.Item控制 */}
          {/* 它的输入内容会在onFinished回调中收集起来 */}

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
            name="stop_datetime"
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
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? '更新' : '提交'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
