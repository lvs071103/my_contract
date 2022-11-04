import React, { Component } from 'react'
import { Card, Form, Input, Checkbox, Button } from 'antd'
// 导入logo.png
import logo from '@/assets/logo.png'
// 导入样式文件
import './index.scss'

export default class Login extends Component {
  onFinish = (values) => {
    console.log(values)
    // values： 放置的是所有表单项中用户输入的内容
  }

  onFinishFailed = (values) => {
    console.log(values)

  }

  render () {
    return (
      <div className='login'>
        <Card className='login-container'>
          <img className='login-logo' src={logo} alt="" />
          {/* 登录表单 */}
          {/* 子项用到的触发事件 需要在Form中都声明一下 */}
          <Form
            validateTrigger={['onBlur', 'onChange']}
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
                {
                  validateTrigger: 'onBlur'
                }
              ]}
            >
              <Input size="large" placeholder="请输入域帐号" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  min: 6,
                  message: '密码长度不能低于６位'
                }
              ]}
            >
              <Input size="large" placeholder="请输入密码" />
            </Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
            >
              <Checkbox className="login-checkbox-label">
                我已阅读并同意「用户协议」和「隐私条款」
              </Checkbox>
            </Form.Item>

            <Form.Item>
              {/* 渲染Button组件为submit按钮 */}
              <Button type="primary" htmlType="submit" size="large" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}
