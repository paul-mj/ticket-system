import Chart from 'react-apexcharts';
import ChartConfig from '../chart.config';
import { useEffect, useState } from 'react';

interface ColumnChartProps {
  data: any[];
  options: any;
  height?: number | string;
  width?: number | string;
}
const ColumnChart = ({ data, options, height, width }: ColumnChartProps) => {
  useEffect(() => {
    if (options && data) {
      setChartData({
        options: {
          ...ChartConfig.ColumnChartConfig,
          ...options ?? {}
        }, data
      })
    }
  }, [options, data])
  const [chartData, setChartData] = useState<ColumnChartProps>({ data: [], options: {} })
  return (
    <Chart type='bar' options={chartData.options} series={chartData.data} height={height} width={width} />
  )
}
export default ColumnChart