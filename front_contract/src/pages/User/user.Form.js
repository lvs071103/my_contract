import React, { useState } from 'react'
import { Form, Button, Select, Input, Checkbox, DatePicker } from 'antd'
import { http } from '@/utils'
import Swal from 'sweetalert2'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
// import moment from 'moment-timezone'


export default function UserForm (props) {
  const permsOptions = []
  const groupOptions = []

  const { permissions, groups, handleOk } = props

  // 获取权限列表
  permissions.map((element) => {
    return permsOptions.push({ label: `Label: ${element.name}`, value: element.id })
  })

  // 获得组列表
  groups.map((element) => {
    return groupOptions.push({ label: `Label: ${element.name}`, value: element.id })
  })


  const formRef = React.createRef()

  const [checked, setChecked] = useState(false)


  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Please select time!',
      },
    ],
  }


  const onFinish = async (values) => {
    // 提交数据
    // console.log(values)
    const response = await http.post('/accounts/user/add', {
      username: values.username,
      password: values.password,
      password2: values.password2,
      is_superuser: values.is_superuser,
      groups: values.groups,
      permissions: values.permissions,
      is_staff: values.is_staff,
      is_active: values.is_active,
      last_name: values.last_name,
      first_name: values.first_name,
      date_joined: values['date_joined'].format('YYYY-MM-DD HH:mm:ss'),
      email: values.email
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

  const [value, setValue] = React.useState([])

  const onReset = () => {
    formRef.current.resetFields()
  }

  const permsSelectProps = {
    mode: 'multiple',
    style: {
      width: '100%',
    },
    value,
    options: permsOptions,
    onChange: (newValue) => {
      setValue(newValue)
    },
    placeholder: 'Select Item...',
    maxTagCount: 'responsive',
  }

  const groupsSelectProps = {
    mode: 'multiple',
    style: {
      width: '100%',
    },
    value,
    options: groupOptions,
    onChange: (newValue) => {
      setValue(newValue)
    },
    placeholder: 'Select Item...',
    maxTagCount: 'responsive',
  }


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
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          },
          {
            min: 6,
            message: 'Password  must be minimum 6 characters.'
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="password2"
        label="确认密码"
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          },
          {
            min: 6,
            message: 'Password  must be minimum 6 characters.'
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="permissions"
        label="权限"
      >
        <Select  {...permsSelectProps} />
      </Form.Item>
      <Form.Item
        name="groups"
        label="用户组"
      >
        <Select {...groupsSelectProps} />
      </Form.Item>
      <Form.Item
        name="is_superuser"
        label="管理员"
        valuePropName={checked}
      >
        <Checkbox onChange={(e) => { setChecked('checked') }}></Checkbox>
      </Form.Item>

      <Form.Item
        name="is_staff"
        label="员工"
        valuePropName={checked}
      >
        <Checkbox onChange={(e) => { setChecked('checked') }}></Checkbox>
      </Form.Item>
      <Form.Item
        name="is_active"
        label="激活"
        valuePropName={checked}
      >
        <Checkbox onChange={(e) => { setChecked('checked') }}></Checkbox>
      </Form.Item>

      <Form.Item
        name="date_joined"
        label="加入时间" {...config}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          locale={locale}
        />
      </Form.Item>

      <Form.Item
        name="first_name"
        label="名"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="last_name"
        label="姓"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            type: 'email',
          },
        ]}
      >
        <Input />
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
