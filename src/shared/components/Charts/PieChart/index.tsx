import Chart from 'react-apexcharts';
import ChartConfig from '../chart.config';
import { useEffect, useState } from 'react';

interface PieChartProps {
  data: any[];
  options: any
}
const PieChart = ({ data, options }: PieChartProps) => {
  useEffect(() => {
    if (options && data) {
      setChartData({
        options: {
          ...ChartConfig.PieChartConfig,
          ...options ?? {}
        }, data
      })
    }
  }, [options, data])
  const [chartData, setChartData] = useState<PieChartProps>({ data: [], options: {} })
  return (
    <Chart type='pie' options={chartData.options} series={chartData.data} />
  )
}
export default PieChart