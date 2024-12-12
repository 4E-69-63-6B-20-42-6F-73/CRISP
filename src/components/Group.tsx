import { tokens } from "@fluentui/react-components";
import React, { ReactNode } from "react";

interface GroupProps {
    children: ReactNode;
    childWidth: string;
    childHeight: string;
}

const Group = ({ children, childHeight, childWidth }: GroupProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                alignItems: "center",
                overflow: "auto",
            }}
        >
            {React.Children.map(children, (child) => (
                <div
                    style={{
                        background: tokens.colorNeutralBackground1,
                        borderRadius: tokens.borderRadiusXLarge,
                        width: childWidth,
                        height: childHeight,
                        minHeight: childHeight,
                        maxHeight: childHeight,
                        padding: "12px",
                        overflow: "auto",
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};

export default Group;
