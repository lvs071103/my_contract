import React, { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import Swal from 'sweetalert2'
import { http } from '@/utils'
import { useEffect } from 'react'


export default function GroupEdit (props) {
  const options = []
  const { cursor, permissions, handleOk, selected } = props

  // 所有权限列表
  permissions.map((element) => {
    return options.push({ label: `Label: ${element.name}`, value: element.id })
  })

  // 处理已选中的权限
  const selectArr = []
  selected.map((item) => {
    return selectArr.push(item.id)
  })
  const [value, setValue] = useState([])

  const formRef = React.createRef()

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
    const response = await http.post(`/accounts/group/edit/${props.id}`, {
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

  useEffect(() => {
    setValue(selectArr)
    formRef.current.setFieldsValue({
      name: cursor.name,
      Permissions: selectProps
    })
  }, [cursor])

  // 重置form表单
  const onReset = () => {
    this.formRef.current.resetFields()
  }

  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      // 给定初始值 
      // initialValues={{ name: cursor.name }}
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
        <Select {...selectProps} />
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
