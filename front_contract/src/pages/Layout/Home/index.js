import './index.scss'

// 思路：
// 1. 看官方文档 把echarts加入项目
// 2. 不抽离定制化参数 先把最小化demo跑起来
// 3. 按照需求，哪些参数需要自定义 抽象出来

import Bar from '@/components/Bar'


export default function Home () {
  return (
    <div>
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
  )
}
