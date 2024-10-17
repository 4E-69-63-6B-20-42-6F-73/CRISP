import { IChartProps, LineChart } from "@fluentui/react-charting";
import { getClusterColor } from "./clusterColerUtils";
import { useMeasure } from "@uidotdev/usehooks";

//Find way to hide vertical dashes and axis

// With this there are no scrollbars and everything is visible
import "./ScatterChartWrapper-hack.css";

interface ScatterChartWrapperProps {
    points: Point[];
}

interface Point {
    x: number;
    y: number;
    cluster: number;
    patientId: string;
    isOutlier: boolean;
}

export function ScatterChartWrapper({ points }: ScatterChartWrapperProps) {
    const [ref, { width, height }] = useMeasure();

    const yMax = Math.max(...points.map((x) => x.y));
    const yMin = Math.min(...points.map((x) => x.y));

    const data: IChartProps = {
        chartTitle: "Line Chart",
        lineChartData: points.map((x) => ({
            data: [
                {
                    x: x.x,
                    y: x.y,
                    xAxisCalloutData: x.isOutlier ? "Outlier" : "No outlier",
                    yAxisCalloutData: "Patient Id:" + x.patientId,
                },
            ],
            legend: `Cluster ${x.cluster}`,
            color: getClusterColor(x.cluster),
        })),
    };

    return (
        <div ref={ref} style={{ height: "100%" }}>
            <LineChart
                data={data}
                hideLegend
                width={width ?? 160}
                height={height ?? 160}
                enableReflow={true}
                yMaxValue={yMax}
                yMinValue={yMin}
            />
        </div>
    );
}
