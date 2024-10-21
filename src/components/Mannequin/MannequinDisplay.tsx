import React, { useRef, useEffect } from "react";
import { Joints } from "./Joints";
import { Mannequin } from "./Mannequin";

interface MannequinDisplayProps {
    jointsWithScore: Record<string, number>;
    fillColor?: string;
}

export const MannequinDisplay: React.FC<MannequinDisplayProps> = ({
    jointsWithScore,
    fillColor,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const radius = 12;

    const orginalHeight = 450;
    const orginalWidth = 363;

    const backgroundImage = useRef<HTMLImageElement>(new Image());
    backgroundImage.current.src = Mannequin;

    const drawCircles = (ctx: CanvasRenderingContext2D) => {
        const currentHeight = canvasRef.current?.height ?? orginalHeight;
        const currentWidth = canvasRef.current?.width ?? orginalWidth;

        const scaleY = currentHeight / orginalHeight;
        const scaleX = currentWidth / orginalWidth;

        const fluentProvider = document.querySelector(
            ".fui-FluentProvider",
        ) as HTMLElement | null;

        const color = fillColor
            ? fillColor
            : fluentProvider
              ? window
                    .getComputedStyle(fluentProvider)
                    .getPropertyValue("--colorBrandBackgroundStatic") || "black"
              : "black";

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scale

        ctx.drawImage(
            backgroundImage.current,
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height,
        );

        Joints.forEach((joint) => {
            const value = jointsWithScore[joint.id] ?? 0;
            ctx.beginPath();
            ctx.arc(
                (joint.x / 4) * scaleX,
                (joint.y / 4) * scaleY,
                value * radius,
                0,
                2 * Math.PI,
            ); // Value is expected to be between 0 and 1
            ctx.fillStyle = value !== 0 ? color : "black";
            ctx.fill();
        });

        ctx.scale(scaleX, scaleY);
    };

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        canvas.width = canvas.parentElement?.clientWidth ?? 0;
        canvas.height = canvas.parentElement?.clientHeight ?? 0;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        backgroundImage.current.onload = () => {};
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (backgroundImage.current.complete) {
            drawCircles(ctx);
        } else {
            backgroundImage.current.onload = () => {
                drawCircles(ctx);
            };
        }
    }, [jointsWithScore]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                minHeight: "0px",
                maxHeight: "100%",
                minWidth: "100%",
                maxWidth: "100%",
            }}
        />
    );
};
