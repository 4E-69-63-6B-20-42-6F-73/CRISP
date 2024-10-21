import { useState } from "react";
import { MannequinDisplay } from "../Mannequin/MannequinDisplay";
import { expectedColumnInFile } from "@/orders";
import { Radio, RadioGroup } from "@fluentui/react-components";
import { getClusterColor } from "./clusterColerUtils";
import { ChartToolbarWrapper } from "./ChartToolbarWrapper";
import Group from "../Group";

interface SwellingPainOverViewProps {
    data: any[];
    clusters: number[];
}

export function SwellingPainOverView({
    data,
    clusters,
}: SwellingPainOverViewProps) {
    const [swelling, pain] = seperateZwellingAndPijn(data);

    const [filtering, setFiltering] = useState<number | null>(null);

    const averageSwelling = MeanOfRecord(
        applyFiltering(swelling, clusters, filtering),
    );
    const averagePain = MeanOfRecord(applyFiltering(pain, clusters, filtering));

    return (
        <>
            <RadioGroup
                onChange={(_, data) => {
                    setFiltering(data.value == "" ? null : Number(data.value));
                }}
                defaultValue=""
                layout="horizontal"
            >
                <Radio value="1" label="Cluster 1" />
                <Radio value="2" label="Cluster 2" />
                <Radio value="3" label="Cluster 3" />
                <Radio value="4" label="Cluster 4" />
                <Radio value="" label="All" />
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
            </Group>
        </>
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
                    .filter(([key, _]) =>
                        expectedColumnInFile[Number(key)].startsWith(
                            "Zwelling",
                        ),
                    )
                    .map(([key, value]) => [
                        expectedColumnInFile[Number(key)].replace(
                            "Zwelling_",
                            "",
                        ),
                        value as number,
                    ]),
            ) as Record<string, number>,
    );

    const pain = data.map(
        (x) =>
            Object.fromEntries(
                Object.entries(x)
                    .filter(([key, _]) =>
                        expectedColumnInFile[Number(key)].startsWith("Pijn"),
                    )
                    .map(([key, value]) => [
                        expectedColumnInFile[Number(key)].replace("Pijn_", ""),
                        value as number,
                    ]),
            ) as Record<string, number>,
    );

    return [swelling, pain];
}

function MeanOfRecord(data: Record<string, number>[]) {
    const keys = Object.keys(data[0]);
    const means: Record<string, number> = {};

    for (const key of keys) {
        means[key] =
            data.map((x) => x[key]).reduce((a, b) => a + b) / data.length;
    }

    return means;
}
function applyFiltering(
    data: Record<string, number>[],
    clusters: number[],
    filtering: number | null,
): Record<string, number>[] {
    return filtering != null
        ? data.filter((_, index) => clusters[index] == filtering)
        : data;
}
