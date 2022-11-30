import { Button, Form, Input, Select } from 'antd'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { http } from '@/utils'
import './index.scss'


const GroupForm = (props) => {
  const options = []
  const perms = props.permissions
  perms.map((element) => {
    return options.push({ label: `Label: ${element.name}`, value: element.id })
  })
  const handleOk = props.handleOk
  const formRef = React.createRef()
  const [value, setValue] = useState([])

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

  const selectProps = {
    mode: 'multiple',
    style: {
      width: '100%',
    },
    value,
    options,
    onChange: (newValue) => {
      setValue(newValue)
    },
    placeholder: 'Select Item...',
    maxTagCount: 'responsive',
  }

  // 提交时请求后端增加group接口
  const onFinish = async (values) => {
    console.log(values.name, values.Permissions)
    const response = await http.post('/accounts/group/add', {
      "name": values.name,
      "permissions": values.Permissions
    })

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

  // 重置form表单
  const onReset = () => {
    this.formRef.current.resetFields()
  }

  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Permissions"
        label="Permissions"
      >
        <Select  {...selectProps} />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  )
}

export default GroupForm