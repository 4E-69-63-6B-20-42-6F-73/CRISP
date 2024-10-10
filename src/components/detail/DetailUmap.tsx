import { UMAP } from "umap-js";
import { ScatterChartWrapper } from "./ScatterChartWrapper";
import { useEffect, useRef, useState } from "react";
import { Spinner, tokens } from "@fluentui/react-components";

import { Toolbar, ToolbarButton, Caption1Strong } from "@fluentui/react-components";

import {
    FullScreenMaximize24Regular,
    ArrowDownload24Regular
} from "@fluentui/react-icons";

import { toPng } from 'html-to-image';

interface DetailUmapProps {
    data: any[]
    clusters: number[]
    patientIds: string[]
}

export function DetailUmap({ data, clusters, patientIds }: DetailUmapProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [points, setPoints] = useState<Point[]>([])

    useEffect(() => {

        async function doUmap() {
            const withoutPatient = data.map(innerList => innerList.slice(1)); // Remove patient number
            const umap = new UMAP({
                nComponents: 2,
                nNeighbors: data.length < 50 ? data.length - 1 : 50,
            })
            const embedding = await umap.fitAsync(withoutPatient)
            setPoints(detectOutliers(mapEmbeddingToPoints(embedding, clusters, patientIds)))
        }
        doUmap()
    }, [])


    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        // This is a workaround to make the pop-over appear in fullscreen mode.
        // Fluentui defines a layer outside the <App> so it isn't in the normal document flow 
        // So if we take a subset of the page and make that fullscreen, it wont show.
        // So this adds that layer to the component that we toggle.
        // We should probably add it to the overlay instead of the container. 
        const tooltipElement = document.getElementById('fluent-default-layer-host');
        const chartContainer = document.getElementById('test');

        if (isFullscreen && tooltipElement && chartContainer) {
            chartContainer.appendChild(tooltipElement);
        }
    }, [isFullscreen]);

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
            toPng(wrapperRef.current)
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'chart.png';
                    link.click();
                })
        }
    };

    return <div ref={wrapperRef} id="test" style={{ height: "240px", width: "200px", backgroundColor: tokens.colorNeutralBackground1, padding: isFullscreen ? "12px" : "" }}>
        {points.length !== 0 ?
            <>
                <Toolbar aria-label="Default" style={{
                    display: "flex",
                    justifyContent: "right",
                    height: "40px"
                }}>
                    <Caption1Strong style={{ flexGrow: 1 }}>
                        UMAP
                    </Caption1Strong>
                    <ToolbarButton
                        aria-label="Toggle fullscreen"
                        icon={<FullScreenMaximize24Regular />}
                        appearance={isFullscreen ? "primary" : "subtle"}
                        onClick={handleFullscreen}
                    />
                    <ToolbarButton aria-label="Download image of graph" icon={<ArrowDownload24Regular />}
                        onClick={downloadChart} />
                </Toolbar>
                <div style={{ height: "calc(100% - 40px)" }}>
                    <ScatterChartWrapper points={points} />
                </div>

            </> :
            <Spinner style={{ height: "inherit" }} size="extra-large" />
        }
    </div>
}

interface Point {
    x: number;
    y: number;
    cluster: number;
    patientId: string;
    isOutlier: boolean;
}

function mapEmbeddingToPoints(embedding: number[][], clusters: number[], patientIds: string[]): Point[] {
    if (embedding.length !== clusters.length || embedding.length !== patientIds.length) {
        throw new Error("Mismatched array lengths between embedding, clusters, and patientIds.");
    }
    const points = embedding.map((coordinate, index) => ({
        x: coordinate[0],
        y: coordinate[1],
        cluster: clusters[index],
        patientId: patientIds[index],
        isOutlier: false
    }));

    return points;
}


function calculateMean(points: Point[]): { meanX: number, meanY: number } {
    const sumX = points.reduce((acc, point) => acc + point.x, 0);
    const sumY = points.reduce((acc, point) => acc + point.y, 0);
    return {
        meanX: sumX / points.length,
        meanY: sumY / points.length,
    };
}

function calculateStandardDeviation(points: Point[], meanX: number, meanY: number): number {
    const variance = points.reduce((acc, point) => {
        const distanceSquared = Math.pow(point.x - meanX, 2) + Math.pow(point.y - meanY, 2);
        return acc + distanceSquared;
    }, 0) / points.length;
    
    return Math.sqrt(variance);
}

function detectOutliers(points: Point[]): Point[] {
    const clusters = new Map<number, Point[]>();

    points.forEach(point => {
        if (!clusters.has(point.cluster)) {
            clusters.set(point.cluster, []);
        }
        clusters.get(point.cluster)?.push(point);
    });

    clusters.forEach((clusterPoints, _) => {
        const { meanX, meanY } = calculateMean(clusterPoints);
        const sd = calculateStandardDeviation(clusterPoints, meanX, meanY);

        clusterPoints.forEach(point => {
            const distance = Math.sqrt(Math.pow(point.x - meanX, 2) + Math.pow(point.y - meanY, 2));
            point.isOutlier = distance > 2 * sd;
        });
    });

    return points;
}