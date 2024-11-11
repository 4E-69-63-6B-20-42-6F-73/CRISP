import { useDebounce } from "@/utils/debounce";
import { MinMax } from "../MinMaxSlider";
import { useState, useEffect } from "react";

interface DetailUmapSettings {
    nNeighbors: number;
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
    const debouncedNNeighbors = useDebounce(nNeighbors, 200);

    useEffect(() => {
        if (debouncedNNeighbors !== initialSettings.nNeighbors) {
            onSettingChange({ nNeighbors: debouncedNNeighbors });
        }
    }, [debouncedNNeighbors, initialSettings.nNeighbors, onSettingChange]);

    return (
        <>
            <MinMax
                label="nNeighbors"
                defaultValue={initialSettings.nNeighbors}
                min={1}
                max={maxNeighbors}
                onChange={(value) => {
                    // Update nNeighbors only if the new value is different
                    if (value !== nNeighbors) {
                        setNNeighbors(value);
                    }
                }}
            />
        </>
    );
}
