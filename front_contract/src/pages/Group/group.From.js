import { Button, Form, Input } from 'antd'
import React from 'react'
import Swal from 'sweetalert2'
import { http } from '@/utils'
import './index.scss'


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
class GroupForm extends React.Component {

  formRef = React.createRef()

  // 提交时请求后端增加group接口
  onFinish = async (values) => {
    const response = await http.post('/accounts/group/add', {
      "name": values.name,
    })
    // console.log(this.props)
    const { handleOk } = this.props

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
  onReset = () => {
    this.formRef.current.resetFields()
  }

  render () {
    return (
      <Form
        {...layout}
        ref={this.formRef}
        name="control-ref"
        onFinish={this.onFinish}
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
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={this.onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
export default GroupForm