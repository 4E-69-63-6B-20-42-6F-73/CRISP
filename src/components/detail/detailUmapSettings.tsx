import { useDebounce } from "@/utils/debounce";
import { MinMax } from "../MinMaxSlider";
import { useState, useEffect } from "react";

interface DetailUmapSettings {
    nNeighbors: number;
    minDist: number;
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

    const debouncedNNeighbors = useDebounce(nNeighbors, 200);
    const debouncedMinDist = useDebounce(minDist, 200);

    useEffect(() => {
        if (
            debouncedNNeighbors !== initialSettings.nNeighbors ||
            debouncedMinDist !== initialSettings.minDist
        ) {
            onSettingChange({
                nNeighbors: debouncedNNeighbors,
                minDist: debouncedMinDist,
            });
        }
    }, [
        debouncedNNeighbors,
        debouncedMinDist,
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
        </>
    );
}
