import { UMAP } from "umap-js";
import { ScatterChartWrapper } from "./ScatterChartWrapper";
import { useEffect, useState } from "react";
import { Spinner } from "@fluentui/react-components";

interface DetailUmapProps {
    data: any[]
    clusters: number[]
    patientIds: string[]
}

export function DetailUmap({ data, clusters, patientIds }: DetailUmapProps) {
    const [points, setPoints] = useState<Point[]>([])

    useEffect(() => {
        new UMAP({
            nComponents: 2,
            nNeighbors: data.length < 50 ? data.length - 1 : 50,
        }).fitAsync(data).then(embedding => setPoints(mapEmbeddingToPoints(embedding, clusters, patientIds)))
    }, [])

    return points.length !== 0 ?
        <ScatterChartWrapper points={points} /> :
    <Spinner style={{height: "inherit"}} size="extra-large" />
}

interface Point {
    x: number;
    y: number;
    cluster: number;
    patientId: string;
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
    }));

    return points;
}