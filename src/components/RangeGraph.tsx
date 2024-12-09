import React, { useEffect, useRef } from "react";
import * as d3 from "d3-shape";

// Types for individual components
type FilledBarProps = {
    start: number;
    end: number;
    color: string;
};

type IndicatorProps = {
    x: number;
    color?: string;
};

type RangeIndicatorProps = {
    start: number;
    end: number;
    color?: string;
};

type StandardDeviationIndicatorProps = {
    sd: number;
    average: number;
    color?: string;
};

const scale = (
    value: number,
    domain: [number, number],
    range: [number, number],
): number => {
    const [domainMin, domainMax] = domain;
    const [rangeMin, rangeMax] = range;

    const domainSpan = domainMax - domainMin;
    const rangeSpan = rangeMax - rangeMin;

    const normalizedValue = (value - domainMin) / domainSpan;

    return rangeMin + normalizedValue * rangeSpan;
};

const FilledBar: React.FC<
    FilledBarProps & { minValue?: number; maxValue?: number }
> = ({ start, end, minValue = 0, maxValue = 100, color }) => {
    const height = "12";

    const startPercentage = scale(start, [minValue, maxValue], [0, 100]);
    const filledWidth = scale(end, [minValue, maxValue], [0, 100]);

    return (
        <rect
            x={startPercentage + "%"}
            y={"25%"}
            width={filledWidth + "%"}
            height={height}
            fill={color}
        />
    );
};

// Indicator Component
const Indicator: React.FC<
    IndicatorProps & { minValue?: number; maxValue?: number }
> = ({ x, minValue = 0, maxValue = 100, color = "blue" }) => {
    const height = 12;
    const x_position = scale(x, [minValue, maxValue], [0, 100]);
    const triangleSize = 1.5 * (height / 4);
    const trianglePath = d3
        .symbol()
        .type(d3.symbolTriangle)
        .size(triangleSize * 10)();

    return (
        <>
            <svg x={x_position + "%"} y="5%" overflow="visible">
                <g transform="rotate(180)">
                    <path d={trianglePath || ""} fill={color} />
                </g>
            </svg>
        </>
    );
};

// RangeIndicator Component
const RangeIndicator: React.FC<
    RangeIndicatorProps & { minValue?: number; maxValue?: number }
> = ({ start, end, minValue = 0, maxValue = 100, color = "purple" }) => {
    const height = 12;
    const x_start = scale(start, [minValue, maxValue], [0, 100]);
    const x_end = scale(end, [minValue, maxValue], [0, 100]);
    const triangleSize = 1.5 * (height / 4);
    const trianglePath = d3
        .symbol()
        .type(d3.symbolTriangle)
        .size(triangleSize * 10)();

    return (
        <>
            <svg x={x_start + "%"} y="75%" overflow="visible">
                <g>
                    <path d={trianglePath || ""} fill={color} />
                </g>
            </svg>
            <svg x={x_end + "%"} y="75%" overflow="visible">
                <g>
                    <path d={trianglePath || ""} fill={color} />
                </g>
            </svg>
        </>
    );
};

// StandardDeviationIndicator Component
const StandardDeviationIndicator: React.FC<
    StandardDeviationIndicatorProps & { minValue?: number; maxValue?: number }
> = ({ sd, average, minValue = 0, maxValue = 100, color = "black" }) => {
    const height = 2;
    const x_begin = scale(average - sd, [minValue, maxValue], [0, 100]);

    // If we dont start at 0, scaling sd will be negative. So
    const x_end = scale(average + sd, [minValue, maxValue], [0, 100]);
    const width = x_end - x_begin;

    return (
        <>
            {/* Left vertical line */}
            <rect
                x={x_begin + "%"}
                y={"30%"} //
                width={"0.5%"}
                height={"20%"}
                fill={color}
            />
            {/* Horizontal line */}
            <rect
                x={x_begin + "%"}
                y={"37%"} // center of filled bar
                width={width + "%"}
                height={height}
                fill={color}
            />
            {/* Right vertical line */}
            <rect
                x={x_begin + width + "%"}
                y={"30%"} //
                width={"0.5%"}
                height={"20%"}
                fill={color}
            />
        </>
    );
};

// RangeGraph Component
type RangeGraphProps = {
    minValue: number;
    maxValue: number;
    label?: string;
    children?: React.ReactNode;
};

const RangeGraph: React.FC<RangeGraphProps> = ({
    label,
    minValue,
    maxValue,
    children,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        const parent = parentRef.current;
        if (!svg || !parent) return;

        // Set SVG size to match the parent's dimensions
        svg.setAttribute("width", `${parent.clientWidth}`);
        svg.setAttribute("height", `${parent.clientHeight}`);
    }, []);

    return (
        <div>
            {label && <span>{label}</span>}

            <div
                ref={parentRef}
                style={{ width: "100%", height: "40px", margin: "0" }}
            >
                <svg ref={svgRef} style={{ width: "100%", height: "100%" }}>
                    <FilledBar
                        start={minValue}
                        end={maxValue}
                        minValue={minValue}
                        maxValue={maxValue}
                        color="lightgray"
                    />

                    {React.Children.map(
                        children,
                        (child) =>
                            child &&
                            React.cloneElement(
                                child as React.ReactElement<any>,
                                { minValue, maxValue },
                            ), // Auw
                    )}

                    {/* Min and Max Labels */}
                    <text
                        x={"0%"}
                        y={"95%"}
                        fontSize={14}
                        textAnchor={"start"}
                        fill={"black"}
                    >
                        {minValue}
                    </text>
                    <text
                        x={"100%"}
                        y={"95%"}
                        fontSize={14}
                        textAnchor={"end"}
                        fill={"black"}
                    >
                        {maxValue}
                    </text>
                </svg>
            </div>
        </div>
    );
};

export {
    RangeGraph,
    FilledBar,
    RangeIndicator,
    Indicator,
    StandardDeviationIndicator,
};
