import { useEffect, useRef, useState } from "react";
import {
    Toolbar,
    ToolbarButton,
    Caption1Strong,
    tokens,
} from "@fluentui/react-components";
import {
    FullScreenMaximize24Regular,
    ArrowDownload24Regular,
} from "@fluentui/react-icons";
import { toPng } from "html-to-image";

interface ChartWrapperProps {
    title: string;
    children: React.ReactNode;
}

export function ChartToolbarWrapper({ title, children }: ChartWrapperProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
        };
    }, []);

    const handleFullscreen = () => {
        if (wrapperRef.current) {
            if (!document.fullscreenElement) {
                wrapperRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    const downloadChart = () => {
        if (wrapperRef.current) {
            toPng(wrapperRef.current).then((dataUrl) => {
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = `${title}.png`;
                link.click();
            });
        }
    };

    return (
        <div
            ref={wrapperRef}
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: tokens.colorNeutralBackground1,
                padding: isFullscreen ? "12px" : "",
            }}
        >
            <Toolbar
                aria-label="Chart Toolbar"
                style={{
                    display: "flex",
                    justifyContent: "right",
                    height: "40px",
                }}
            >
                <Caption1Strong style={{ flexGrow: 1 }}>{title}</Caption1Strong>
                <ToolbarButton
                    aria-label="Toggle fullscreen"
                    icon={<FullScreenMaximize24Regular />}
                    appearance={isFullscreen ? "primary" : "subtle"}
                    onClick={handleFullscreen}
                />
                <ToolbarButton
                    aria-label="Download image of graph"
                    icon={<ArrowDownload24Regular />}
                    onClick={downloadChart}
                />
            </Toolbar>
            <div style={{ height: "calc(100% - 40px)" }}>{children}</div>
        </div>
    );
}
