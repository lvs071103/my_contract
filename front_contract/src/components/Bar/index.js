import React from 'react'
import { useRef, useEffect } from 'react'
import * as echarts from 'echarts'

export default function Bar ({ title, xData, yData, style }) {

  const domRef = useRef()
  const chartInit = () => {
    // 基于准备好的dom， 初始化echarts实例
    const myChart = echarts.init(domRef.current)
    // 绘制图表
    myChart.setOption({
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        data: xData
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: yData
        }
      ]
    })
  }

  useEffect(() => {
    chartInit()
  },
    // eslint-disable-next-line
    []
  )

  return (
    <div>
      {/* 准备一个挂载节点 */}
      <div ref={domRef} style={style}></div>
    </div>
  )
}
