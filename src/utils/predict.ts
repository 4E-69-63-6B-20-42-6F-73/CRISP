import { expectedOrderForModel } from "@/orders";

var globalWorker: Worker;

function getWorker() {
    if (!globalWorker) {
        globalWorker = new Worker("/CRISP/web_model/predictWorker.js");
    }

    return globalWorker;
}

export function predict({
    data,
    onProgress,
    onComplete,
    onError,
}: {
    data: any[];
    onProgress: (type: string, index: number, total: number) => void;
    onComplete: (predictions: any) => void;
    onError: (error: any) => void;
}) {
    try {
        const worker = getWorker();

        const pre_processed = data.map((x) => pre_process(x));
        worker.postMessage({ data: pre_processed });

        worker.onmessage = (event) => {
            const { type, index, total, predictions } = event.data;

            if (type === "loading" || type === "progress") {
                onProgress(type, index, total);
            } else if (type === "done") {
                onComplete(predictions);
                // worker.terminate();
            }
        };

        worker.onerror = (error) => {
            onError(error);
            worker.terminate();
        };

        return () => {
            // worker.terminate();
        };
    } catch (error) {
        onError(error);
    }
}

// Preprocess by duplicating keys with pijn or zwelling into _positieve and _negatieve and reorder as expected by the model. And capitalize first letters
function pre_process(data: any) {
    const copy = { ...data };

    for (const key of Object.keys(data)) {
        const value = copy[key];

        if (key.includes("Pijn") || key.includes("Zwelling")) {
            copy[`${key}_positive`] = value;
            copy[`${key}_negative`] = value == 1 ? 0 : 1;

            delete copy[key];
        }
    }

    copy["Age_Early"] = copy["Age"] < 65 ? 1 : 0;
    copy["Age_Late"] = copy["Age"] >= 65 ? 1 : 0;

    copy["Sex"] = copy["Sex"][0] == "M" ? 0 : 1;

    console.log(copy);

    const a = reorderObjectValuesByKeyList(copy, expectedOrderForModel);

    console.log(a);

    return a;
}

const reorderObjectValuesByKeyList = (obj: any, keyOrder: string[]): any[] => {
    const result = keyOrder.filter((key) => key in obj).map((key) => obj[key]);

    if (result.length !== keyOrder.length) {
        const missingKeys = keyOrder.filter((key) => !(key in obj));
        throw new Error("Missing properties:" + missingKeys);
    }

    return result;
};