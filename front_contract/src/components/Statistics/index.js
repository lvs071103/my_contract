import React, { useEffect, useState } from 'react'
// import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { http } from '@/utils'

export default function MyStatistics () {

  const [users, setUsers] = useState(0)
  const [groups, setGroups] = useState(0)
  const [suppliers, setSuppliers] = useState(0)
  const [contracts, setContracts] = useState(0)

  useEffect(() => {
    const to_do = async () => {
      const res = await http.get("statistic/sum/")
      setUsers(res.data.users)
      setGroups(res.data.groups)
      setSuppliers(res.data.suppliers)
      setContracts(res.data.contracts)
    }
    to_do()
  }, [])

  return (
    <>
      <div className="site-statistic-demo-card">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="用户组"
                value={groups}
                // precision={2}
                valueStyle={{
                  color: '#3f8600',
                }}
              // prefix={<ArrowUpOutlined />}
              // suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="用户"
                value={users}
                // precision={2}
                valueStyle={{
                  color: 'red',
                }}
              // prefix={<ArrowUpOutlined />}
              // suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="合同"
                value={contracts}
                // precision={2}
                valueStyle={{
                  color: '#cf1322',
                }}
              // prefix={<ArrowDownOutlined />}
              // suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="供应商"
                value={suppliers}
                // precision={2}
                valueStyle={{
                  color: 'blue',
                }}
              // prefix={<ArrowDownOutlined />}
              // suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}
