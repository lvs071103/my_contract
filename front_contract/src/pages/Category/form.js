import React from 'react'
import { Form, Input, Button } from 'antd'
import { http } from '@/utils'
import Swal from 'sweetalert2'
import { useEffect } from 'react'

const { TextArea } = Input

export default function CategoryForm (props) {
  const formRef = React.createRef()
  const { id, title, handleOk } = props

  console.log(id)

  const submitURL = id ? `/contract/category/edit/${id}` : '/contract/category/add'

  const onFinish = async (values) => {
    // 提交数据
    // console.log(values)
    const request_params = {
      name: values.name,
      desc: values.desc
    }

    const response = await http.post(submitURL, { request_params })
    if (response.data.success === true) {
      Swal.fire({
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
      // 关闭弹窗
      handleOk()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: response.data.message,
      })
    }
  }

  const onReset = () => {
    formRef.current.resetFields()
  }

  // 编辑
  // 数据回填, id调用接口，1.表单回填 2.暂存列表
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`contract/category/detail/${id}`)
      const categories = res.data.supplier_obj
      formRef.current.setFieldsValue({
        name: categories.name,
        desc: categories.desc,
      })
    }
    if (id) {
      loadDetail()
    } else {
      onReset()
    }

  },
    // eslint-disable-next-line 
    [id])


  const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
  }

  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 16,
    },
  }

  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="name"
        label="分类"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="desc"
        label="详情"
      >
        <TextArea rows={4} />
      </Form.Item>

      {title !== '详情' ?
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item> : null}
    </Form >
  )
}
