
import { useEffect, useState } from "react";
import Worker from "./umapWorker.js?worker"

interface UseUmapResult {
    embedding: number[][];
    loading: boolean;
    error: string | null;
}

export function useUmap(data: any[]): UseUmapResult {
    const [embedding, setEmbedding] = useState<number[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

        console.log("Called useUmap")

        const worker = new Worker()

        worker.postMessage({ data });

        worker.onmessage = (e) => {
            if (e.data.error) {
                setError(e.data.error);
                setLoading(false);
            } else {
                const { embedding } = e.data;
                setEmbedding(embedding);
                setLoading(false);
            }
        };

        worker.onerror = () => {
            console.log(error)
            setError("Error in UMAP computation.");
            setLoading(false);
        };

    return { embedding, loading, error };
}