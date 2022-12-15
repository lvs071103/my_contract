import React, { useState } from 'react'
import { Descriptions, Badge, Upload } from 'antd'
import { useEffect } from 'react'
import { http } from '@/utils'
import moment from "moment"



const Detail = (props) => {
  const { id } = props
  const [contracts, setContracts] = useState({})
  const [files, setFiles] = useState()

  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`contract/contract/detail/${id}`)
      const tmpList = []
      res.data.fileList.map(
        (fileObj) => {
          tmpList.push({
            'uid': fileObj.id,
            'status': fileObj.status,
            'url': fileObj.url,
            'name': fileObj.name,
          })
          return tmpList
        }
      )
      setFiles(tmpList)
      setContracts(res.data.data)
    }
    if (id) {
      loadDetail()
    }
  }, [id])

  const test = {
    fileList: files,
    onDownload: file => {
      console.log(111111111111)
    },
    showUploadList: {
      showDownloadIcon: true,
      showRemoveIcon: false,
    }
  }
  return (
    <>
      <Descriptions title="基本信息" layout="vertical" bordered>
        <Descriptions.Item label="合同名称">{contracts.name}</Descriptions.Item>
        <Descriptions.Item label="合同价格">{contracts.price}</Descriptions.Item>
        <Descriptions.Item label="文本类型">{contracts.types === '1' ? '合同' : '订单'}</Descriptions.Item>
        <Descriptions.Item label="项目经理">{contracts.owner}</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {moment(contracts.create_datetime).format("YYYY-MM-DD HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="合同开始时间">
          {moment(contracts.start_datetime).format("YYYY-MM-DD HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="合同截止时间">
          {moment(contracts.end_datetime).format("YYYY-MM-DD HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="状态" span={3}>
          {contracts.status ?
            <Badge status="processing" text="已完成" /> :
            <Badge status="processing" text="履约中" />
          }
        </Descriptions.Item>
        <Descriptions.Item label="用途" span={3}>
          {contracts.purpose}
        </Descriptions.Item>

        <Descriptions.Item label="供应商">
          {contracts.suppliers &&
            contracts.suppliers.name ?
            contracts.suppliers.name : null}
        </Descriptions.Item>
        <Descriptions.Item label="联系人">
          {contracts.suppliers &&
            contracts.suppliers.manager ?
            contracts.suppliers.manager : null}
        </Descriptions.Item>
        <Descriptions.Item label="联系电话">
          {contracts.suppliers &&
            contracts.suppliers.tel ?
            contracts.suppliers.tel : null}
        </Descriptions.Item>

        <Descriptions.Item label="描述" span={3}>
          {contracts.suppliers &&
            contracts.suppliers.desc ?
            contracts.suppliers.desc : null}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Descriptions title="附件信息" layout="vertical" bordered>
        <Descriptions.Item label="附件">
          <Upload {...test}>
          </Upload>
        </Descriptions.Item>
      </Descriptions>

    </>
  )
}
export default Detail