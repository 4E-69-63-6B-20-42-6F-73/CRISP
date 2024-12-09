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

type TriangleProps = {
    size: number;
    color?: string;
    rotation?: number;
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
            y={"35%"}
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
    const x_position = scale(x, [minValue, maxValue], [0, 100]);
    return (
        <>
            <svg x={x_position + "%"} y="0%">
                <Triangle rotation={180} size={50} color={color} />
            </svg>
        </>
    );
};

// RangeIndicator Component
const RangeIndicator: React.FC<
    RangeIndicatorProps & { minValue?: number; maxValue?: number }
> = ({ start, end, minValue = 0, maxValue = 100, color = "purple" }) => {
    return (
        <>
            <Indicator
                x={start}
                color={color}
                minValue={minValue}
                maxValue={maxValue}
            />
            <Indicator
                x={end}
                color={color}
                minValue={minValue}
                maxValue={maxValue}
            />
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
                y={"40%"} //
                width={height}
                height={"20%"}
                fill={color}
            />
            {/* Horizontal line */}
            <rect
                x={x_begin + "%"}
                y={"48%"} // center of filled bar
                width={width + "%"}
                height={height}
                fill={color}
            />
            {/* Right vertical line */}
            <rect
                x={x_begin + width + "%"}
                y={"40%"} //
                width={height}
                height={"20%"}
                fill={color}
            />
        </>
    );
};

const Triangle: React.FC<TriangleProps> = ({
    size,
    color = "blue",
    rotation = 0,
}) => {
    const trianglePath = d3.symbol().type(d3.symbolTriangle).size(size)();

    return (
        <svg width={size / 4} height={size / 4}>
            <g
                transform={`translate(${size / 8}, ${size / 8}) rotate(${rotation})`}
            >
                <path d={trianglePath || ""} fill={color} />
            </g>
        </svg>
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
    Triangle,
};
