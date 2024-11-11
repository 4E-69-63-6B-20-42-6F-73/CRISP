import * as React from "react";
import {
    Combobox as FluentCombobox,
    makeStyles,
    useId,
} from "@fluentui/react-components";
import type { ComboboxProps as FluentComboboxProps } from "@fluentui/react-components";

// Define the custom styles
const useStyles = makeStyles({
    root: {
        display: "grid",
        gridTemplateRows: "repeat(1fr)",
        justifyItems: "start",
        gap: "2px",
        maxWidth: "400px",
    },
});

interface ComboboxProps extends Partial<FluentComboboxProps> {
    label?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
    label = "Select an option",
    children,
    ...props
}) => {
    const comboId = useId("combobox");
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <label id={comboId}>{label}</label>
            <FluentCombobox
                inlinePopup
                aria-labelledby={comboId}
                placeholder="Select an option"
                {...props}
            >
                {children}
            </FluentCombobox>
        </div>
    );
};
