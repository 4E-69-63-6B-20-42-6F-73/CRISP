import { useState } from "react";
import { Button, TagGroup, tokens } from "@fluentui/react-components";

import {
    useGetAnalysesById,
    useUpdateAnalyse,
} from "@/stores/ApplicationStore";

import { useNavigate, useParams } from "@/router";
import { ToggableTag } from "@/components/reorder/ToggableTag";
import { OrderedClickableMannequin } from "@/components/Mannequin/OrderedClickableMannequin";
import { expectedColumnInFile } from "@/orders";
import setsAreEqual from "@/utils/setsAreEqual";

const numeric = [
    "PATNR",
    "Leuko",
    "Hb",
    "MCV",
    "Trom",
    "Age",
    "BSE",
    "RF",
    "aCCP",
    "Sex",
];

export default function Reorder() {
    const params = useParams("/predict/:id");
    const id = Number(params.id);

    const navigate = useNavigate();

    const analyse = useGetAnalysesById(id);
    const updateAnalyse = useUpdateAnalyse();

    // For now we assume that every files has the same columns
    const data = analyse.files[0].content.slice(0, 5);
    const oldColumns = Object.keys(data[0]);

    const [order, setOrder] = useState<string[]>(
        getInitialOrder(oldColumns, expectedColumnInFile),
    );

    const toggle = (x: string): void => {
        if (order.includes(x)) {
            setOrder(order.filter((y) => y !== x));
        } else {
            const firstEmptyString = order.indexOf("");

            if (firstEmptyString != -1) {
                const newOrder = [...order];
                newOrder[firstEmptyString] = x;
                setOrder(newOrder);
            } else {
                setOrder([...order, x]);
            }
        }
    };

    function replaceColumns(): void {
        const updatedFiles = analyse.files.map((x) => ({
            ...x,
            content: x.content.map((y) => transform(y, order)),
        }));

        const updatedAnalyse = {
            ...analyse,
            files: updatedFiles,
        };
        updateAnalyse(updatedAnalyse);
        navigate("/predict/:id", { params: { id: id.toString() } });
    }

    return (
        <>
            <div>
                <h2>Mapping</h2>
                <p>
                    Your data is missing some required column names that our
                    model expects. Please click the buttons in the order that
                    matches your data to assign the correct column names
                </p>
            </div>

            <div>
                <h2>Columns</h2>
                <TagGroup>
                    {numeric.map((x) => (
                        <ToggableTag
                            text={x}
                            isSelected={order.includes(x)}
                            order={order.findIndex((y) => y === x) + 1}
                            key={x}
                            onClick={() => {
                                toggle(x);
                            }}
                        />
                    ))}
                </TagGroup>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                <div>
                    <h2>Swelling</h2>
                    <OrderedClickableMannequin
                        order={order}
                        setOrder={setOrder}
                        id_prefix="Zwelling"
                    />
                </div>

                <div>
                    <h2>Pain</h2>
                    <OrderedClickableMannequin
                        order={order}
                        setOrder={setOrder}
                        id_prefix="Pijn"
                    />
                </div>
            </div>
            <div>
                <h2>Data</h2>
                <div style={{ overflow: "auto" }}>
                    <div
                        style={{
                            width: "fit-content",
                            backgroundColor: tokens.colorNeutralBackground1,
                            borderRadius: tokens.borderRadiusLarge,
                        }}
                    >
                        <table>
                            <thead>
                                <tr key="new">
                                    <th> New columns </th>
                                    {order.map((x, index) => (
                                        <th key={`new-${index}`}>{x}</th>
                                    ))}
                                </tr>
                                <tr key="old">
                                    <th> Old columns </th>
                                    {oldColumns.map((x, index) => (
                                        <th key={`old-${index}`}>{x}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((record, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td></td>
                                        {Object.values(record).map(
                                            (value, colIndex) => (
                                                <td key={colIndex}>
                                                    {value as string}
                                                </td>
                                            ),
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "end",
                }}
            >
                <Button
                    appearance="primary"
                    disabled={
                        !setsAreEqual(
                            new Set(expectedColumnInFile),
                            new Set(order),
                        )
                    }
                    onClick={() => replaceColumns()}
                >
                    Finish
                </Button>
            </div>
        </>
    );
}

// We want to find the order of matching item between old and expected.
function getInitialOrder(
    oldColumns: string[],
    expectedColumnInFile: string[],
): string[] {
    const indexs = oldColumns.map((x) =>
        expectedColumnInFile.findIndex((y) => x === y),
    );
    const initialOrder = indexs.map((x) => (x !== -1 ? oldColumns[x] : ""));

    return initialOrder;
}

// Rename each object property
function transform(object: any, newProperties: string[]): any {
    const transformed: any = {};

    const keys = Object.keys(object);

    for (let i = 0; i < keys.length && i < newProperties.length; i++) {
        const oldKey = keys[i];
        const newKey = newProperties[i];
        const value = object[oldKey];
        transformed[newKey] = value;
    }

    return transformed;
}
