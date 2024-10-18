import { useEffect, useState } from "react";
import { ProgressBar } from "@fluentui/react-components";

import {
    useGetAnalysesById,
    useAddPrediction,
} from "@/stores/ApplicationStore";

import { useNavigate, useParams } from "@/router";
import { expectedColumnInFile, expectedOrderForModel } from "@/orders";
import setsAreEqual from "@/utils/setsAreEqual";

const reorderObjectValuesByKeyList = (obj: any, keyOrder: string[]): any[] => {
    return keyOrder.filter((key) => key in obj).map((key) => obj[key]);
};

export default function Predict() {
    const params = useParams("/predict/:id");
    const id = Number(params.id);

    const navigate = useNavigate();

    const addPrediction = useAddPrediction();
    const [text, setText] = useState(getText("", 0, 0));
    const analyse = useGetAnalysesById(id);

    const data = analyse.files
        .flatMap((x) => x.content as any[])
        .map((contentItem: any) => pre_process(contentItem));

    useEffect(() => {
        if (analyse.prediction !== undefined) {
            navigate("/detail/:id", { params: { id: id.toString() } });
        }
        if (
            !setsAreEqual(
                new Set(expectedColumnInFile),
                new Set(Object.keys(analyse.files[0].content[0])),
            )
        ) {
            navigate("/reorder/:id", { params: { id: id.toString() } });
        }

        const worker = new Worker("/CRISP/web_model/predictWorker.js");
        worker.postMessage({ data });

        worker.onmessage = (event) => {
            const {
                type,
                index,
                total,
                predictions: workerPredictions,
            } = event.data;

            if (type === "loading") {
                setText(getText("loading", index, total));
            }
            if (type === "progress") {
                setText(getText("predicting", index, total));
            } else if (type === "done") {
                addPrediction(id, workerPredictions);
                worker.terminate();
                navigate("/detail/:id", { params: { id: id.toString() } });
            }
        };

        return () => {
            worker.terminate();
        };
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
            }}
        >
            <div
                style={{
                    minHeight: "200px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                }}
            >
                <h3>{text.line3}</h3>
                <h2>{text.line2}</h2>
                <h1>{text.line1}</h1>
            </div>

            <ProgressBar style={{ width: "50%" }} />
            <p>Please do not close this window</p>
        </div>
    );
}

const getText = (
    state: "loading" | "loaded" | "predicting" | "done" | "",
    predicted: number,
    total: number,
) => {
    switch (state) {
        case "":
        case "loading":
            return { line1: "Loading model", line2: "", line3: "" };
        case "loaded":
            return { line1: "Model loaded", line2: "Loading model", line3: "" };
        case "predicting":
            return {
                line1: `Predicting ${predicted + 1} / ${total}`,
                line2: "Model loaded",
                line3: "Loading model",
            };
        default:
            return { line1: "", line2: "", line3: "" };
    }
};

// Preprocess by duplicating keys with pijn or zwelling into _positieve and _negatieve and reorder as expected by the model.
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

    return reorderObjectValuesByKeyList(copy, expectedOrderForModel);
}
