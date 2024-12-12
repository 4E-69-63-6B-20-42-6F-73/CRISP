import { ReactNode, useState } from "react";
import { MannequinDisplay } from "../Mannequin/MannequinDisplay";
import { Radio, RadioGroup, Text } from "@fluentui/react-components";
import { getClusterColor } from "./clusterColerUtils";
import { ChartToolbarWrapper } from "./ChartToolbarWrapper";

import Group from "../Group";
import { FileInput } from "@/types";
import {
    AverageIndicator,
    FilledBarPercentageIndicator,
    FilledBarRangeIndicator,
    RangeGraph,
    RangeIndicator,
    StandardDeviationIndicator,
    Triangle,
} from "../RangeGraph";
import { standardDeviation } from "@/utils/standardDeviation";

const pallete = [
    "#fd7f6f",
    "#7eb0d5",
    "#b2e061",
    "#adebb3",
    "#ffb55a",
    "#808080",
    "#beb9db",
    "#fdcce5",
    "#8bd3c7",
    "#bd7ebe",
];

const parameterConfig = [
    {
        label: "Leuko",
        minValue: 0,
        maxValue: 20,
        acceptedRange: [4, 10],
    },
    {
        label: "Hb",
        minValue: 0,
        maxValue: 20,
        acceptedRange: [8, 10],
    },
    {
        label: "MCV",
        minValue: 50,
        maxValue: 250,
        acceptedRange: [80, 100],
    },
    {
        label: "Trom",
        minValue: 0,
        maxValue: 1100,
        acceptedRange: [150, 400],
    },
    {
        label: "BSE",
        minValue: 0,
        maxValue: 140,
        acceptedRange: [0, 25],
    },
    {
        label: "Age",
        minValue: 0,
        maxValue: 120,
    },
];

interface SwellingPainOverViewProps {
    data: FileInput[];
    clusters: number[];
}

export function SwellingPainOverView({
    data,
    clusters,
}: SwellingPainOverViewProps) {
    const [filtering, setFiltering] = useState<number | null>(null);

    const filtered_data = applyFiltering(data, clusters, filtering);

    const [swelling, pain] = seperateZwellingAndPijn(filtered_data);
    const averageSwelling = MeanOfRecord(swelling);
    const averagePain = MeanOfRecord(pain);

    const averages = MeanOfRecord(filtered_data);

    return (
        <>
            <RadioGroup
                onChange={(_, data) => {
                    setFiltering(data.value == "" ? null : Number(data.value));
                }}
                defaultValue=""
                layout="horizontal"
            >
                <Radio
                    value="1"
                    label={
                        <>
                            Cluster 1
                            <br />
                            <Text size={200}>
                                Mostly feet joints are affected
                            </Text>
                        </>
                    }
                />
                <Radio
                    value="2"
                    label={
                        <>
                            Cluster 2
                            <br />
                            <Text size={200}>
                                Mostly seropositive patients and <br /> limited
                                joint involvement
                            </Text>
                        </>
                    }
                />
                <Radio
                    value="3"
                    label={
                        <>
                            Cluster 3
                            <br />
                            <Text size={200}>
                                Symmetrical polyarthritis of hands with <br />{" "}
                                seronegative elderly patients
                            </Text>
                        </>
                    }
                />
                <Radio
                    value="4"
                    label={
                        <>
                            Cluster 4
                            <br />
                            <Text size={200}>
                                Majority seronegative polyarthritis in hand and
                                feet <br /> though with lower ESR.
                            </Text>
                        </>
                    }
                />
                <Radio
                    value=""
                    label={
                        <>
                            All
                            <br />
                            <Text size={200}>Show all patients</Text>
                        </>
                    }
                />
            </RadioGroup>

            <Group childHeight="500px" childWidth="400px">
                <ChartToolbarWrapper
                    title={"Average swelling " + getSuffix(filtering)}
                >
                    <MannequinDisplay
                        jointsWithScore={averageSwelling}
                        fillColor={getClusterColor(filtering)}
                    ></MannequinDisplay>
                </ChartToolbarWrapper>

                <ChartToolbarWrapper
                    title={"Average pain " + getSuffix(filtering)}
                >
                    <MannequinDisplay
                        jointsWithScore={averagePain}
                        fillColor={getClusterColor(filtering)}
                    ></MannequinDisplay>
                </ChartToolbarWrapper>

                <ChartToolbarWrapper title="Characteristics">
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            flexDirection: "column",
                            height: "inherit",
                        }}
                    >
                        {parameterConfig.map(
                            (
                                { label, minValue, maxValue, acceptedRange },
                                i,
                            ) => (
                                <RangeGraph
                                    key={label}
                                    label={label}
                                    minValue={minValue}
                                    maxValue={maxValue}
                                >
                                    <FilledBarRangeIndicator
                                        start={Math.min(
                                            ...filtered_data.map(
                                                (x) => x[label] as number,
                                            ),
                                        )}
                                        end={Math.max(
                                            ...filtered_data.map(
                                                (x) => x[label] as number,
                                            ),
                                        )}
                                        color={pallete[i]}
                                    />
                                    {acceptedRange && (
                                        <RangeIndicator
                                            start={acceptedRange[0]}
                                            end={acceptedRange[1]}
                                        />
                                    )}
                                    <AverageIndicator x={averages[label]} />
                                    <StandardDeviationIndicator
                                        sd={standardDeviation(
                                            filtered_data.map(
                                                (x) => x[label] as number,
                                            ),
                                            filtering === null,
                                        )}
                                        average={averages[label]}
                                    />
                                </RangeGraph>
                            ),
                        )}

                        <RangeGraph label="Sex" minValue={0} maxValue={100}>
                            <FilledBarPercentageIndicator
                                start={0}
                                percentage={
                                    (filtered_data.filter(
                                        (x) => x.Sex[0] === "M",
                                    ).length /
                                        filtered_data.length) *
                                    100
                                }
                                label="Male"
                                color={"lightblue"}
                            />
                            <FilledBarPercentageIndicator
                                start={
                                    (filtered_data.filter(
                                        (x) => x.Sex[0] === "M",
                                    ).length /
                                        filtered_data.length) *
                                    100
                                }
                                percentage={
                                    (filtered_data.filter(
                                        (x) => x.Sex[0] !== "M",
                                    ).length /
                                        filtered_data.length) *
                                    100
                                }
                                label="Female"
                                color={"pink"}
                            />
                        </RangeGraph>

                        <RangeGraph label="RF" minValue={0} maxValue={100}>
                            <FilledBarPercentageIndicator
                                start={0}
                                percentage={
                                    (filtered_data.filter((x) => x.RF === 1)
                                        .length /
                                        filtered_data.length) *
                                    100
                                }
                                label="RF positive"
                                color={pallete[8]}
                            />
                            <FilledBarPercentageIndicator
                                start={
                                    (filtered_data.filter((x) => x.RF === 1)
                                        .length /
                                        filtered_data.length) *
                                    100
                                }
                                percentage={
                                    (filtered_data.filter((x) => x.RF === 0)
                                        .length /
                                        filtered_data.length) *
                                    100
                                }
                                label="RF negative"
                                color={"lightgray"}
                            />
                        </RangeGraph>

                        <RangeGraph label="aCCP" minValue={0} maxValue={100}>
                            <FilledBarPercentageIndicator
                                start={0}
                                percentage={
                                    (filtered_data.filter((x) => x.aCCP === 1)
                                        .length /
                                        filtered_data.length) *
                                    100
                                }
                                label="aCCP positive"
                                color={pallete[9]}
                            />
                            <FilledBarPercentageIndicator
                                start={
                                    (filtered_data.filter((x) => x.aCCP === 1)
                                        .length /
                                        filtered_data.length) *
                                    100
                                }
                                percentage={
                                    (filtered_data.filter((x) => x.aCCP === 0)
                                        .length /
                                        filtered_data.length) *
                                    100
                                }
                                label="aCCP negative"
                                color={"lightgray"}
                            />
                        </RangeGraph>

                        {RenderLegend()}
                    </div>
                </ChartToolbarWrapper>
            </Group>
        </>
    );
}

function RenderLegend(): ReactNode {
    return (
        <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ display: "flex", gap: "5px" }}>
                <div>
                    <Triangle size={40} rotation={180} />
                </div>
                <span> Average </span>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
                <div>
                    <Triangle size={40} rotation={180} color="purple" />
                </div>
                <span> Normal range </span>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ width: "20px", height: "15px" }}>
                    <svg style={{ width: "20px", height: "15px" }}>
                        {/* Left vertical line */}
                        <rect
                            x={0}
                            y={5}
                            width={2}
                            height={10}
                            fill={"black"}
                        />
                        {/* Horizontal line */}
                        <rect
                            x={0}
                            y={9}
                            width={15}
                            height={2}
                            fill={"black"}
                        />
                        {/* Right vertical line */}
                        <rect
                            x={15}
                            y={5}
                            width={2}
                            height={10}
                            fill={"black"}
                        />
                    </svg>
                </div>
                <span> Standard deviation </span>
            </div>
        </div>
    );
}

function getSuffix(filtering: number | null) {
    if (filtering == null) {
        return "(All)";
    }
    return `(Cluster ${filtering})`;
}

// Since the input format has swelling and pain combined diffrentiated by prefix, we must seperate them.
function seperateZwellingAndPijn(
    data: any[],
): [Record<string, number>[], any[]] {
    const swelling = data.map(
        (x) =>
            Object.fromEntries(
                Object.entries(x)
                    .filter(([key, _]) => key.startsWith("Zwelling"))
                    .map(([key, value]) => [
                        key.replace("Zwelling_", ""),
                        value as number,
                    ]),
            ) as Record<string, number>,
    );

    const pain = data.map(
        (x) =>
            Object.fromEntries(
                Object.entries(x)
                    .filter(([key, _]) => key.startsWith("Pijn"))
                    .map(([key, value]) => [
                        key.replace("Pijn_", ""),
                        value as number,
                    ]),
            ) as Record<string, number>,
    );

    return [swelling, pain];
}

function MeanOfRecord(data: Record<string, number>[]) {
    if (data.length === 0) {
        return {};
    }
    const keys = Object.keys(data[0]);
    const means: Record<string, number> = {};

    for (const key of keys) {
        means[key] =
            data.map((x) => x[key]).reduce((a, b) => a + b) / data.length;
    }

    return means;
}
function applyFiltering<T>(
    data: T[],
    clusters: number[],
    filtering: number | null,
): T[] {
    return filtering != null
        ? data.filter((_, index) => clusters[index] == filtering)
        : data;
}
