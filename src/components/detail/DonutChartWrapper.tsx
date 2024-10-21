import { DonutChart, IChartProps } from "@fluentui/react-charting";
import { getClusterColor } from "./clusterColerUtils";
import { useMeasure } from "@uidotdev/usehooks";

interface DonutChartWrapperProps {
    counts: {
        1: number;
        2: number;
        3: number;
        4: number;
    };
}

export function DonutChartWrapper({ counts }: DonutChartWrapperProps) {
    const [ref, { width, height }] = useMeasure();

    const data: IChartProps = {
        chartTitle: "OVerview per cluster",
        chartData: [
            { legend: "Cluster 1", data: counts[1], color: getClusterColor(1) },
            { legend: "Cluster 2", data: counts[2], color: getClusterColor(2) },
            { legend: "Cluster 3", data: counts[3], color: getClusterColor(3) },
            { legend: "Cluster 4", data: counts[4], color: getClusterColor(4) },
        ],
    };

    return (
        <div ref={ref} style={{ height: "100%" }}>
            <DonutChart
                data={data}
                innerRadius={35}
                legendProps={{
                    allowFocusOnLegends: true,
                }}
                hideLegend
                hideLabels={false}
                showLabelsInPercent={false}
                valueInsideDonut={counts[1] + counts[2] + counts[3] + counts[4]}
                width={width ?? 200}
                height={height ?? 200}
            />
        </div>
    );
}
