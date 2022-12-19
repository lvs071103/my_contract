import './index.scss'

// 思路：
// 1. 看官方文档 把echarts加入项目
// 2. 不抽离定制化参数 先把最小化demo跑起来
// 3. 按照需求，哪些参数需要自定义 抽象出来

import Bar from '@/components/Bar'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'


export default function Home () {
  return (
    <>
      <div className="site-statistic-demo-card">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active"
                value={11.28}
                precision={2}
                valueStyle={{
                  color: '#3f8600',
                }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active"
                value={11.28}
                precision={2}
                valueStyle={{
                  color: 'red',
                }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Idle"
                value={9.3}
                precision={2}
                valueStyle={{
                  color: '#cf1322',
                }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Idle"
                value={9.3}
                precision={2}
                valueStyle={{
                  color: 'blue',
                }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
        <br />
        {/* 渲染Bar组件 */}
        <Bar
          title={'主流框架使用满意度1'}
          xData={['react', 'vue', 'angular']}
          yData={[300, 400, 500]}
          style={{ width: '600px', height: '300px' }}
        />
        <Bar
          title={'主流框架使用满意度2'}
          xData={['react', 'vue', 'angular']}
          yData={[700, 800, 900]}
          style={{ width: '600px', height: '300px' }}
        />
      </div>
    </>
  )
}
