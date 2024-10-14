import { useEffect, useState } from "react";
import { ProgressBar } from "@fluentui/react-components";

import {
    useGetAnalysesById,
    useAddPrediction,
} from "@/stores/ApplicationStore";

import { useNavigate, useParams } from "@/router";


const lcat = ['Zwelling_Elleboog L_negative', 'Zwelling_Elleboog L_positive', 'Zwelling_IP links_negative', 'Zwelling_IP links_positive', 'Zwelling_IP rechts_negative', 'Zwelling_IP rechts_positive', 'Zwelling_acromioclaviaculair L_negative', 'Zwelling_acromioclaviaculair L_positive', 'Zwelling_acromioclaviaculair R_negative', 'Zwelling_acromioclaviaculair R_positive', 'Zwelling_bovenste spronggewicht links_negative', 'Zwelling_bovenste spronggewicht links_positive', 'Zwelling_bovenste spronggewricht rechts_negative', 'Zwelling_bovenste spronggewricht rechts_positive', 'Zwelling_dip 2 links_negative', 'Zwelling_dip 2 links_positive', 'Zwelling_dip 2 rechts_negative', 'Zwelling_dip 2 rechts_positive', 'Zwelling_dip 3 links_negative', 'Zwelling_dip 3 links_positive', 'Zwelling_dip 3 rechts_negative', 'Zwelling_dip 3 rechts_positive', 'Zwelling_dip 4 links_negative', 'Zwelling_dip 4 links_positive', 'Zwelling_dip 4 rechts_negative', 'Zwelling_dip 4 rechts_positive', 'Zwelling_dip 5 links_negative', 'Zwelling_dip 5 links_positive', 'Zwelling_dip 5 rechts_negative', 'Zwelling_dip 5 rechts_positive', 'Zwelling_elleboog R_negative', 'Zwelling_elleboog R_positive', 'Zwelling_knie links_negative', 'Zwelling_knie links_positive', 'Zwelling_knie rechts_negative', 'Zwelling_knie rechts_positive', 'Zwelling_mcp 1 links_negative', 'Zwelling_mcp 1 links_positive', 'Zwelling_mcp 1 rechts_negative', 'Zwelling_mcp 1 rechts_positive', 'Zwelling_mcp 2 links_negative', 'Zwelling_mcp 2 links_positive', 'Zwelling_mcp 2 rechts_negative', 'Zwelling_mcp 2 rechts_positive', 'Zwelling_mcp 3 links_negative', 'Zwelling_mcp 3 links_positive', 'Zwelling_mcp 3 rechts_negative', 'Zwelling_mcp 3 rechts_positive', 'Zwelling_mcp 4 links_negative', 'Zwelling_mcp 4 links_positive', 'Zwelling_mcp 4 rechts_negative', 'Zwelling_mcp 4 rechts_positive', 'Zwelling_mcp 5 links_negative', 'Zwelling_mcp 5 links_positive', 'Zwelling_mcp 5 rechts_negative', 'Zwelling_mcp 5 rechts_positive', 'Zwelling_mtp 1 links_negative', 'Zwelling_mtp 1 links_positive', 'Zwelling_mtp 1 rechts_negative', 'Zwelling_mtp 1 rechts_positive', 'Zwelling_mtp 2 links_negative', 'Zwelling_mtp 2 links_positive', 'Zwelling_mtp 2 rechts_negative', 'Zwelling_mtp 2 rechts_positive', 'Zwelling_mtp 3 links_negative', 'Zwelling_mtp 3 links_positive', 'Zwelling_mtp 3 rechts_negative', 'Zwelling_mtp 3 rechts_positive', 'Zwelling_mtp 4 links_negative', 'Zwelling_mtp 4 links_positive', 'Zwelling_mtp 4 rechts_negative', 'Zwelling_mtp 4 rechts_positive', 'Zwelling_mtp 5 links_negative', 'Zwelling_mtp 5 links_positive', 'Zwelling_mtp 5 rechts_negative', 'Zwelling_mtp 5 rechts_positive', 'Zwelling_onderste spronggewricht links_negative', 'Zwelling_onderste spronggewricht links_positive', 'Zwelling_onderste spronggewricht rechts_negative', 'Zwelling_onderste spronggewricht rechts_positive', 'Zwelling_pip 2 links hand_negative', 'Zwelling_pip 2 links hand_positive', 'Zwelling_pip 2 rechts hand_negative', 'Zwelling_pip 2 rechts hand_positive', 'Zwelling_pip 3 links hand_negative', 'Zwelling_pip 3 links hand_positive', 'Zwelling_pip 3 rechts hand_negative', 'Zwelling_pip 3 rechts hand_positive', 'Zwelling_pip 4 links hand_negative', 'Zwelling_pip 4 links hand_positive', 'Zwelling_pip 4 rechts hand_negative', 'Zwelling_pip 4 rechts hand_positive', 'Zwelling_pip 5 links hand_negative', 'Zwelling_pip 5 links hand_positive', 'Zwelling_pip 5 rechts hand_negative', 'Zwelling_pip 5 rechts hand_positive', 'Zwelling_pols L_negative', 'Zwelling_pols L_positive', 'Zwelling_pols R_negative', 'Zwelling_pols R_positive', 'Zwelling_schouder L_negative', 'Zwelling_schouder L_positive', 'Zwelling_schouder R_negative', 'Zwelling_schouder R_positive', 'Zwelling_sternoclaviculair L_negative', 'Zwelling_sternoclaviculair L_positive', 'Zwelling_sternoclaviculair R_negative', 'Zwelling_sternoclaviculair R_positive', 'Zwelling_tarsometatarsaal L_negative', 'Zwelling_tarsometatarsaal L_positive', 'Zwelling_tarsometatarsaal R_negative', 'Zwelling_tarsometatarsaal R_positive', 'Zwelling_temporomandibulair L_negative', 'Zwelling_temporomandibulair L_positive', 'Zwelling_temporomandibulair R_negative', 'Zwelling_temporomandibulair R_positive', 'Pijn_Elleboog L_negative', 'Pijn_Elleboog L_positive', 'Pijn_IP links_negative', 'Pijn_IP links_positive', 'Pijn_IP rechts_negative', 'Pijn_IP rechts_positive', 'Pijn_acromioclaviaculair L_negative', 'Pijn_acromioclaviaculair L_positive', 'Pijn_acromioclaviaculair R_negative', 'Pijn_acromioclaviaculair R_positive', 'Pijn_bovenste spronggewicht links_negative', 'Pijn_bovenste spronggewicht links_positive', 'Pijn_bovenste spronggewricht rechts_negative', 'Pijn_bovenste spronggewricht rechts_positive', 'Pijn_dip 2 links_negative', 'Pijn_dip 2 links_positive', 'Pijn_dip 2 rechts_negative', 'Pijn_dip 2 rechts_positive', 'Pijn_dip 3 links_negative', 'Pijn_dip 3 links_positive', 'Pijn_dip 3 rechts_negative', 'Pijn_dip 3 rechts_positive', 'Pijn_dip 4 links_negative', 'Pijn_dip 4 links_positive', 'Pijn_dip 4 rechts_negative', 'Pijn_dip 4 rechts_positive', 'Pijn_dip 5 links_negative', 'Pijn_dip 5 links_positive', 'Pijn_dip 5 rechts_negative', 'Pijn_dip 5 rechts_positive', 'Pijn_elleboog R_negative', 'Pijn_elleboog R_positive', 'Pijn_heup links_negative', 'Pijn_heup links_positive', 'Pijn_heup rechts_negative', 'Pijn_heup rechts_positive', 'Pijn_knie links_negative', 'Pijn_knie links_positive', 'Pijn_knie rechts_negative', 'Pijn_knie rechts_positive', 'Pijn_mcp 1 links_negative', 'Pijn_mcp 1 links_positive', 'Pijn_mcp 1 rechts_negative', 'Pijn_mcp 1 rechts_positive', 'Pijn_mcp 2 links_negative', 'Pijn_mcp 2 links_positive', 'Pijn_mcp 2 rechts_negative', 'Pijn_mcp 2 rechts_positive', 'Pijn_mcp 3 links_negative', 'Pijn_mcp 3 links_positive', 'Pijn_mcp 3 rechts_negative', 'Pijn_mcp 3 rechts_positive', 'Pijn_mcp 4 links_negative', 'Pijn_mcp 4 links_positive', 'Pijn_mcp 4 rechts_negative', 'Pijn_mcp 4 rechts_positive', 'Pijn_mcp 5 links_negative', 'Pijn_mcp 5 links_positive', 'Pijn_mcp 5 rechts_negative', 'Pijn_mcp 5 rechts_positive', 'Pijn_mtp 1 links_negative', 'Pijn_mtp 1 links_positive', 'Pijn_mtp 1 rechts_negative', 'Pijn_mtp 1 rechts_positive', 'Pijn_mtp 2 links_negative', 'Pijn_mtp 2 links_positive', 'Pijn_mtp 2 rechts_negative', 'Pijn_mtp 2 rechts_positive', 'Pijn_mtp 3 links_negative', 'Pijn_mtp 3 links_positive', 'Pijn_mtp 3 rechts_negative', 'Pijn_mtp 3 rechts_positive', 'Pijn_mtp 4 links_negative', 'Pijn_mtp 4 links_positive', 'Pijn_mtp 4 rechts_negative', 'Pijn_mtp 4 rechts_positive', 'Pijn_mtp 5 links_negative', 'Pijn_mtp 5 links_positive', 'Pijn_mtp 5 rechts_negative', 'Pijn_mtp 5 rechts_positive', 'Pijn_onderste spronggewricht links_negative', 'Pijn_onderste spronggewricht links_positive', 'Pijn_onderste spronggewricht rechts_negative', 'Pijn_onderste spronggewricht rechts_positive', 'Pijn_pip 2 links hand_negative', 'Pijn_pip 2 links hand_positive', 'Pijn_pip 2 rechts hand_negative', 'Pijn_pip 2 rechts hand_positive', 'Pijn_pip 3 links hand_negative', 'Pijn_pip 3 links hand_positive', 'Pijn_pip 3 rechts hand_negative', 'Pijn_pip 3 rechts hand_positive', 'Pijn_pip 4 links hand_negative', 'Pijn_pip 4 links hand_positive', 'Pijn_pip 4 rechts hand_negative', 'Pijn_pip 4 rechts hand_positive', 'Pijn_pip 5 links hand_negative', 'Pijn_pip 5 links hand_positive', 'Pijn_pip 5 rechts hand_negative', 'Pijn_pip 5 rechts hand_positive', 'Pijn_pols L_negative', 'Pijn_pols L_positive', 'Pijn_pols R_negative', 'Pijn_pols R_positive', 'Pijn_schouder L_negative', 'Pijn_schouder L_positive', 'Pijn_schouder R_negative', 'Pijn_schouder R_positive', 'Pijn_sternoclaviculair L_negative', 'Pijn_sternoclaviculair L_positive', 'Pijn_sternoclaviculair R_negative', 'Pijn_sternoclaviculair R_positive', 'Pijn_tarsometatarsaal L_negative', 'Pijn_tarsometatarsaal L_positive', 'Pijn_tarsometatarsaal R_negative', 'Pijn_tarsometatarsaal R_positive', 'Pijn_temporomandibulair L_negative', 'Pijn_temporomandibulair L_positive', 'Pijn_temporomandibulair R_negative', 'Pijn_temporomandibulair R_positive', 'RF', 'aCCP', 'Sex', 'Age_Early', 'Age_Late']
const lnum = ['Leuko', 'Hb', 'MCV', 'Trom', 'BSE', 'Age']

const dataOrder = ["PATNR"].concat(lnum).concat(lcat)

const reorderObjectValuesByKeyList = (obj: any, keyOrder: string[]): any[] => {
    return keyOrder
        .filter(key => key in obj)
        .map(key => obj[key]);
};

export default function Predict() {
    const params = useParams("/predict/:id");
    const id = Number(params.id);

    const navigate = useNavigate();

    const addPrediction = useAddPrediction();
    const [text, setText] = useState(getText("", 0, 0))
    const analyse = useGetAnalysesById(id);

    const data = analyse.files
        .flatMap(x => x.content as any[])
        .map((contentItem: any) => reorderObjectValuesByKeyList(contentItem, dataOrder));  // Reorder and extract values)

    if (analyse.prediction !== undefined) {
        navigate("/detail/:id", { params: { id: id.toString() } });
    }

    useEffect(() => {
        const worker = new Worker("/CRISP/web_model/predictWorker.js");
        worker.postMessage({ data });

        worker.onmessage = (event) => {
            const { type, index, total, predictions: workerPredictions } = event.data;

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


const getText = (state: "loading" | "loaded" | "predicting" | "done" | "", predicted: number, total: number) => {
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
