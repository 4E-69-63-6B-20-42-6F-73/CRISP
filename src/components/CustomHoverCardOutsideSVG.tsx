import React, { useState, useRef, useEffect } from "react";
import { ChartHoverCard } from "@fluentui/react-charting";
import ReactDOM from "react-dom";

interface HoverCardProps {
    data: {
        xValue?: string; // Tertiary label
        yValue: string | number; // Primary label
        color: string;
        legend: string; // Secondary label
    };
    children: React.ReactNode;
}

const CustomHoverCardOutsideSVG: React.FC<HoverCardProps> = ({
    data,
    children,
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [hoverCardSize, setHoverCardSize] = useState({ width: 0, height: 0 });
    const hoverCardRef = useRef<HTMLDivElement | null>(null);

    const svgRef = useRef<SVGSVGElement | null>(null);

    const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
        const { clientX, clientY } = event;

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate potential overflow using hover card dimensions
        const adjustedX =
            clientX + hoverCardSize.width + 20 > viewportWidth
                ? clientX - hoverCardSize.width - 10
                : clientX + 10;

        const adjustedY =
            clientY + hoverCardSize.height + 20 > viewportHeight
                ? clientY - hoverCardSize.height - 10
                : clientY + 10;

        setHoverPosition({
            x: adjustedX,
            y: adjustedY,
        });
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    // Measure the size of the ChartHoverCard after it is rendered
    useEffect(() => {
        if (hoverCardRef.current) {
            const { width, height } =
                hoverCardRef.current.getBoundingClientRect();
            setHoverCardSize({ width, height });
        }
    }, [isHovering]);

    return (
        <>
            <svg
                ref={svgRef}
                style={{ display: "inline-block" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {children}
            </svg>
            {isHovering &&
                ReactDOM.createPortal(
                    <div
                        ref={hoverCardRef}
                        style={{
                            position: "absolute",
                            top: hoverPosition.y,
                            left: hoverPosition.x,
                            zIndex: 1000,
                            pointerEvents: "none",
                            boxShadow:
                                "rgba(0, 0, 0, 0.133) 0px 6.4px 14.4px 0px, rgba(0, 0, 0, 0.11) 0px 1.2px 3.6px 0px",
                        }}
                    >
                        <ChartHoverCard
                            XValue={data.xValue}
                            YValue={data.yValue}
                            color={data.color}
                            Legend={data.legend}
                        />
                    </div>,
                    document.body, // Rendering directly into the body
                )}
        </>
    );
};

export default CustomHoverCardOutsideSVG;
