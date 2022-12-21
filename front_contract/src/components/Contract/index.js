import React, { useEffect, useState } from 'react'
import { Column } from '@ant-design/plots'
import { http } from '@/utils'

const DemoColumn = () => {

  const [dataList, setDataList] = useState([])
  useEffect(() => {
    const loadStatistics = async () => {
      const res = await http.get('statistic/contracts')
      const data = res.data.data
      setDataList(data)
    }
    loadStatistics()
  }, [])

  const data = dataList
  const config = {
    data,
    isGroup: true,
    xField: '月份',
    yField: '数量',
    seriesField: 'name',

    /** 设置颜色 */
    //color: ['#1ca9e6', '#f88c24'],

    /** 设置间距 */
    // marginRatio: 0.1,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'middle', 'bottom'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
  }
  return <Column {...config} />
}

export default DemoColumn