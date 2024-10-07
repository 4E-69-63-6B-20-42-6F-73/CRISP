import { IChartProps, LineChart } from '@fluentui/react-charting';
import { getClusterColor } from './clusterColerUtils';
import { useMeasure } from "@uidotdev/usehooks";

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
  const [ref, { width, height }] = useMeasure();

  const yMax = Math.max(...points.map(x => x.y))
  const yMin = Math.min(...points.map(x => x.y))
  
  const data: IChartProps = {
    chartTitle: 'Line Chart',
    lineChartData: points.map(x => ({
      data: [
        { x: x.x, y: x.y, xAxisCalloutData: 'No outlier', yAxisCalloutData: "Patient Id:" + x.patientId },
      ],
      legend: `Cluster ${x.cluster}`,
      color: getClusterColor(x.cluster)
    }))
  };

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {
        ref !== null &&
        <LineChart
          data={data}
          hideLegend
          width={width ?? 160}
          height={(height ?? 160)}
          enableReflow={true}

          yMaxValue={yMax}
          yMinValue={yMin}
        />}
    </div>

  );
}
