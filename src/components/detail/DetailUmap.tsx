import { UMAP } from "umap-js";
import { ScatterChartWrapper } from "./ScatterChartWrapper";
import { useEffect, useState } from "react";
import { Spinner } from "@fluentui/react-components";
import MinMaxScaler from "@/utils/minMaxScaler";

interface DetailUmapProps {
    data: any[];
    clusters: number[];
    patientIds: string[];
}

export function DetailUmap({ data, clusters, patientIds }: DetailUmapProps) {
    //TODO something is weird. Initial render is correct, but after exiting fullscreen the UMAP has an heigt of 240px
    // So lets set the max-heigt to 200 if we are not in fullscreen
    const [isFullscreen, setIsFullscreen] = useState(
        !!document.fullscreenElement,
    );

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

    const [points, setPoints] = useState<Point[]>([]);

    useEffect(() => {
        async function doUmap() {
            const withoutPatient = scaleData(
                encodeStrings(data.map((innerList) => innerList.slice(1))),
            ); // Remove patient number and encode strings as numbers and scale data
            const umap = new UMAP({
                nComponents: 2,
                nNeighbors: data.length < 50 ? data.length - 1 : 50,
            });
            const embedding = await umap.fitAsync(withoutPatient);
            setPoints(
                detectOutliers(
                    mapEmbeddingToPoints(embedding, clusters, patientIds),
                ),
            );
        }
        doUmap();
    }, []);

    return (
        <>
            {points.length !== 0 ? (
                <div
                    style={{
                        height: "inherit",
                        maxHeight: isFullscreen ? "unset" : "200px",
                    }}
                >
                    <ScatterChartWrapper points={points} />
                </div>
            ) : (
                <div
                    style={{
                        height: "inherit",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Spinner size="extra-large" />
                </div>
            )}
        </>
    );
}

interface Point {
    x: number;
    y: number;
    cluster: number;
    patientId: string;
    isOutlier: boolean;
}

function mapEmbeddingToPoints(
    embedding: number[][],
    clusters: number[],
    patientIds: string[],
): Point[] {
    if (
        embedding.length !== clusters.length ||
        embedding.length !== patientIds.length
    ) {
        throw new Error(
            "Mismatched array lengths between embedding, clusters, and patientIds.",
        );
    }
    const points = embedding.map((coordinate, index) => ({
        x: coordinate[0],
        y: coordinate[1],
        cluster: clusters[index],
        patientId: patientIds[index],
        isOutlier: false,
    }));

    return points;
}

function calculateMean(points: Point[]): { meanX: number; meanY: number } {
    const sumX = points.reduce((acc, point) => acc + point.x, 0);
    const sumY = points.reduce((acc, point) => acc + point.y, 0);
    return {
        meanX: sumX / points.length,
        meanY: sumY / points.length,
    };
}

function calculateStandardDeviation(
    points: Point[],
    meanX: number,
    meanY: number,
): number {
    const variance =
        points.reduce((acc, point) => {
            const distanceSquared =
                Math.pow(point.x - meanX, 2) + Math.pow(point.y - meanY, 2);
            return acc + distanceSquared;
        }, 0) / points.length;

    return Math.sqrt(variance);
}

function detectOutliers(points: Point[]): Point[] {
    const clusters = new Map<number, Point[]>();

    points.forEach((point) => {
        if (!clusters.has(point.cluster)) {
            clusters.set(point.cluster, []);
        }
        clusters.get(point.cluster)?.push(point);
    });

    clusters.forEach((clusterPoints, _) => {
        const { meanX, meanY } = calculateMean(clusterPoints);
        const sd = calculateStandardDeviation(clusterPoints, meanX, meanY);

        clusterPoints.forEach((point) => {
            const distance = Math.sqrt(
                Math.pow(point.x - meanX, 2) + Math.pow(point.y - meanY, 2),
            );
            point.isOutlier = distance > 2 * sd;
        });
    });

    return points;
}

function encodeStrings(matrix: any[][]): any[][] {
    const stringMap = new Map<string, number>();
    let stringCounter = 1;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (typeof matrix[i][j] === "string") {
                if (!stringMap.has(matrix[i][j])) {
                    stringMap.set(matrix[i][j], stringCounter++);
                }
                matrix[i][j] = stringMap.get(matrix[i][j]);
            }
        }
    }

    return matrix;
}
function scaleData(data: any[][]): any[][] {
    const featuresCount = data[0].length;

    for (let index = 0; index < featuresCount; index++) {
        const scalar = new MinMaxScaler();
        const column = data.map((x) => x[index]);
        const scaled = scalar.fitTransform(column);

        for (let i = 0; i < data.length; i++) {
            data[i][index] = scaled[i];
        }
    }
    return data;
}
