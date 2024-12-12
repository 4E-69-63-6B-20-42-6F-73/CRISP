import { ReactElement, useEffect, useRef, useState } from "react";
import {
    Toolbar,
    ToolbarButton,
    Caption1Strong,
    tokens,
    Popover,
    PopoverSurface,
    PopoverTrigger,
} from "@fluentui/react-components";
import {
    FullScreenMaximize24Regular,
    ArrowDownload24Regular,
    Settings24Regular,
} from "@fluentui/react-icons";
import { toPng } from "html-to-image";

interface ChartWrapperProps {
    title: string;
    children: React.ReactNode;
    settings?: ReactElement;
}

export function ChartToolbarWrapper({
    title,
    children,
    settings,
}: ChartWrapperProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Listen to only exiting fullscreen.
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isNowFullscreen = !!document.fullscreenElement;
            if (!isNowFullscreen) {
                setIsFullscreen(false);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
        };
    }, []);

    useEffect(() => {
        // This is a workaround to make the pop-over appear in fullscreen mode.
        // Fluentui defines a layer outside the <App> so it isn't in the normal document flow
        // So if we take a subset of the page and make that fullscreen, it won't show.
        // So this adds that layer to the component that we toggle.
        // And after closing fullscreen we move it back to the orginal parent.

        const tooltipElement = document.getElementById(
            "fluent-default-layer-host",
        );
        const chartContainer = wrapperRef.current;
        let originalParent: HTMLElement | null = null;

        if (tooltipElement) {
            // Save the original parent the first time we manipulate the tooltip element
            if (!originalParent) {
                originalParent = tooltipElement.parentElement;
            }

            if (isFullscreen && chartContainer) {
                chartContainer.append(tooltipElement);
            } else if (!isFullscreen) {
                if (chartContainer && chartContainer.contains(tooltipElement)) {
                    chartContainer.removeChild(tooltipElement);
                }
                if (originalParent) {
                    originalParent.append(tooltipElement);
                }
            }
        }
    }, [isFullscreen]);

    const handleFullscreen = () => {
        if (wrapperRef.current) {
            if (!isFullscreen) {
                wrapperRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const downloadChart = () => {
        const margin = 20; // in pixel
        if (wrapperRef.current) {
            toPng(wrapperRef.current, {
                filter: (node) => node.tagName !== "BUTTON",
                width: wrapperRef.current.scrollWidth + 2 * margin,
                height: wrapperRef.current.scrollHeight + 2 * margin,
                style: {
                    padding: `${margin}px`,
                },
            }).then((dataUrl) => {
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
                display: "flex",
                flexDirection: "column",
                minHeight: "0px",
            }}
        >
            <Toolbar
                aria-label="Chart Toolbar"
                style={{
                    display: "flex",
                    justifyContent: "right",
                    height: "40px",
                    padding: "0",
                }}
            >
                <Caption1Strong style={{ flexGrow: 1 }}>{title}</Caption1Strong>
                {settings !== undefined ? (
                    <Popover
                        onOpenChange={(_, data) => setIsSettingsOpen(data.open)}
                        inline
                    >
                        <PopoverTrigger disableButtonEnhancement>
                            <ToolbarButton
                                aria-label="OpenSettings"
                                icon={<Settings24Regular />}
                                appearance={
                                    isSettingsOpen ? "primary" : "subtle"
                                }
                            />
                        </PopoverTrigger>

                        <PopoverSurface tabIndex={-1}>
                            <>{settings}</>
                        </PopoverSurface>
                    </Popover>
                ) : (
                    <></>
                )}
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
            <div
                style={{
                    flexGrow: "1",
                    height: "100%",
                    minHeight: "0px", // When using flex, we should also set min-height.
                    flexShrink: "1",
                }}
            >
                {children}
            </div>
        </div>
    );
}
