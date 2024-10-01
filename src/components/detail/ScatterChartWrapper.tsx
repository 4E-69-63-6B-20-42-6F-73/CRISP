import { IChartProps, LineChart } from '@fluentui/react-charting';
import { getClusterColor } from './clusterColerUtils';

//Find way to hide vertical dashes and axis

interface ScatterChartWrapperProps {
  points: Point[]
}

interface Point {
  x: number;
  y: number;
  cluster: number;
  patientId: string;
}


export function ScatterChartWrapper({ points }: ScatterChartWrapperProps) {
  const data: IChartProps = {
    chartTitle: 'Line Chart',
    lineChartData: points.map(x => ({  data: [
      { x: x.x, y: x.y, xAxisCalloutData: 'No outlier', yAxisCalloutData: "Patient Id:" + x.patientId },
    ],
    legend: `Cluster ${x.cluster}`,
    color: getClusterColor(x.cluster)}))
  };

  return (
      <LineChart 
        data={data}
        hideLegend
        width={160}
        height={160}
        enablePerfOptimization
        enableReflow 
      />
  );  
}
