import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@fluentui/react-components";

import {
    useGetAnalysesById,
    useAddPrediction,
} from "@/stores/ApplicationStore";

import { useNavigate, useParams } from "@/router";
import { predict } from "@/utils/predict";

export default function Predict() {
    const params = useParams("/predict/:id");
    const id = Number(params.id);

    const navigate = useNavigate();

    const addPrediction = useAddPrediction();
    const [text, setText] = useState(getText("", 0, 0));
    const analyse = useGetAnalysesById(id);
    const data = useMemo(
        () => analyse.files.flatMap((x) => x.content),
        [analyse],
    );

    useEffect(() => {
        if (analyse.prediction !== undefined) {
            navigate("/detail/:id", { params: { id: id.toString() } });
        }

        const cleanup = predict({
            data,
            onProgress: (type, index, total) => {
                setText(
                    getText(
                        type === "loading" ? "loading" : "predicting",
                        index,
                        total,
                    ),
                );
            },
            onComplete: (predictions) => {
                addPrediction(id, predictions);
                navigate("/detail/:id", { params: { id: id.toString() } });
            },
            onError: (error) => {
                console.error("Prediction error:", error);
            },
        });

        return cleanup;
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
