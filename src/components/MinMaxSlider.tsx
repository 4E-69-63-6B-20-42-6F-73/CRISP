import * as React from "react";
import {
    useId,
    Label,
    makeStyles,
    Tooltip,
    Slider,
} from "@fluentui/react-components";
import { useState, useEffect } from "react";

const useStyles = makeStyles({
    wrapper: {
        display: "flex",
        alignItems: "center",
    },
});

interface MinMaxProps {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    label?: string;
    onChange?: (value: number) => void;
}

export const MinMax: React.FC<MinMaxProps> = ({
    min = 0,
    max = 100,
    step,
    defaultValue,
    label,
    onChange,
}) => {
    const [thumbRef, setThumbRef] = React.useState<HTMLElement | null>(null);
    const [value, setValue] = useState(defaultValue ?? min);
    const styles = useStyles();
    const id = useId();

    // Track if the component is mounted to prevent firing onChange on initial render
    const isMounted = React.useRef(false);

    const handleChange = (_: unknown, data: { value: number }) => {
        setValue(data.value);
        if (onChange && isMounted.current) {
            onChange(data.value);
        }
    };

    // Set isMounted to true after the initial render
    useEffect(() => {
        isMounted.current = true;
    }, []);

    return (
        <>
            <Label htmlFor={id}>{label}</Label>
            <div className={styles.wrapper}>
                <Label aria-hidden>{min}</Label>
                <Tooltip
                    content={value.toString()}
                    relationship="label"
                    withArrow
                    mountNode={thumbRef}
                    positioning={{ target: thumbRef }}
                >
                    <Slider
                        thumb={{ ref: setThumbRef }}
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        id={id}
                        onChange={handleChange}
                    />
                </Tooltip>
                <Label aria-hidden>{max}</Label>
            </div>
        </>
    );
};
