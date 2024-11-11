import { useDebounce } from "@/utils/debounce";
import { MinMax } from "../MinMaxSlider";
import { useState, useEffect } from "react";
import { Combobox } from "@/components/Combobox";
import { Option } from "@fluentui/react-components";

interface DetailUmapSettings {
    nNeighbors: number;
    minDist: number;
    distanceFunction: "euclidean" | "cosine";
}

interface DetailUmapSettingsProps {
    initialSettings: DetailUmapSettings;
    maxNeighbors: number;
    onSettingChange: (newSettings: DetailUmapSettings) => void;
}

export function DetailUmapSettings({
    initialSettings,
    maxNeighbors,
    onSettingChange,
}: DetailUmapSettingsProps) {
    const [nNeighbors, setNNeighbors] = useState(initialSettings.nNeighbors);
    const [minDist, setMinDist] = useState(initialSettings.minDist);
    const [distanceFunction, setDistanceFunction] = useState(
        initialSettings.distanceFunction || "euclidean",
    );

    const debouncedNNeighbors = useDebounce(nNeighbors, 200);
    const debouncedMinDist = useDebounce(minDist, 200);
    const debouncedDistanceFunction = useDebounce(distanceFunction, 200);

    useEffect(() => {
        if (
            debouncedNNeighbors !== initialSettings.nNeighbors ||
            debouncedMinDist !== initialSettings.minDist ||
            debouncedDistanceFunction !== initialSettings.distanceFunction
        ) {
            onSettingChange({
                nNeighbors: debouncedNNeighbors,
                minDist: debouncedMinDist,
                distanceFunction: debouncedDistanceFunction,
            });
        }
    }, [
        debouncedNNeighbors,
        debouncedMinDist,
        debouncedDistanceFunction,
        initialSettings,
        onSettingChange,
    ]);

    return (
        <>
            <MinMax
                label="nNeighbors"
                defaultValue={initialSettings.nNeighbors}
                min={1}
                max={maxNeighbors}
                onChange={(value) => {
                    if (value !== nNeighbors) {
                        setNNeighbors(value);
                    }
                }}
            />
            <MinMax
                label="minDist"
                defaultValue={initialSettings.minDist}
                min={0.01}
                max={1}
                step={0.01}
                onChange={(value) => {
                    if (value !== minDist) {
                        setMinDist(value);
                    }
                }}
            />
            <Combobox
                label="Distance function"
                defaultValue={initialSettings.distanceFunction || "euclidean"}
                onOptionSelect={(_, data) => {
                    let newDistanceFunction =
                        data.optionValue === "euclidean"
                            ? "euclidean"
                            : ("cosine" as "euclidean" | "cosine");
                    if (newDistanceFunction !== distanceFunction) {
                        setDistanceFunction(newDistanceFunction);
                    }
                }}
            >
                <Option key="euclidean">euclidean</Option>
                <Option key="cosine">cosine</Option>
            </Combobox>
        </>
    );
}
