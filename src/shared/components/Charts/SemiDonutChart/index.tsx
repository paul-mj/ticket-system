

import Chart from 'react-apexcharts';
import ChartConfig from '../chart.config';
import { useEffect, useState } from 'react';

interface SemiDonutChartProps {
  data: any[];
  options: any;
  height?: number | string;
  width?: number | string;
}
const SemiDonutChart = ({ data, options, height, width }: SemiDonutChartProps) => {
  useEffect(() => {
    if (options && data) {
      setChartData({
        options: { 
          ...ChartConfig.SemiDonutChartConfig,
          ...options ?? {}
        }, data
      })
    }
  }, [options, data])
  const [chartData, setChartData] = useState<SemiDonutChartProps>({ data: [], options: {} })
  return (
    <Chart type='donut' options={chartData.options} series={chartData.data} height={height} width={width} />
  )
}
export default SemiDonutChart