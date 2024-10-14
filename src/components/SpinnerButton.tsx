import React, { useState } from "react";
import { Button, Spinner } from "@fluentui/react-components";

type SpinnerButtonProps = {
    appearance: "primary";
    icon?: any;
    disabled?: boolean;
    onClick: () => Promise<void>;
    children: React.ReactNode;
};

const SpinnerButton: React.FC<SpinnerButtonProps> = ({
    appearance,
    children,
    icon,
    disabled,
    onClick,
}) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            await onClick();
        } finally {
            setLoading(false);
        }
    };
    return (
        <Button
            appearance={appearance}
            disabled={loading || disabled}
            icon={loading ? <Spinner size="tiny" /> : icon}
            onClick={handleClick}
        >
            {loading ? "Processing..." : children}
        </Button>
    );
};

export default SpinnerButton;
