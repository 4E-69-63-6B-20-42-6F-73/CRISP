import React from "react";
import {
    DataGrid,
    DataGridHeader,
    DataGridBody,
    DataGridRow,
    DataGridCell,
    DataGridHeaderCell,
    TableColumnDefinition,
    createTableColumn,
    TableCellLayout,
} from "@fluentui/react-components";
import { Prediction } from "@/types";

const DetailDataGrid: React.FC<{ items: Prediction[] }> = ({ items }) => {
    const columns: TableColumnDefinition<Prediction>[] = [
        createTableColumn<Prediction>({
            columnId: "PatientId",
            compare: (a, b) =>
                a.patientId.toString().localeCompare(b.patientId.toString()), // Make sure it's a string
            renderHeaderCell: () => "Patient Id",
            renderCell: (item) => (
                <TableCellLayout>{item.patientId}</TableCellLayout>
            ),
        }),
        createTableColumn<Prediction>({
            columnId: "Prediction",
            compare: (a, b) => a.prediction - b.prediction, // Compare as numbers
            renderHeaderCell: () => "Prediction",
            renderCell: (item) => (
                <TableCellLayout>{item.prediction}</TableCellLayout>
            ),
        }),
    ];

    return (
        <DataGrid
            items={items}
            columns={columns}
            sortable
            getRowId={(item) => item.patientId.toString()}
            focusMode="composite"
            style={{ minWidth: "550px" }}
        >
            <DataGridHeader>
                <DataGridRow>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>
                            {renderHeaderCell()}
                        </DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody<Prediction>>
                {({ item, rowId }) => (
                    <DataGridRow<Prediction>
                        key={rowId}
                        style={{ cursor: "pointer" }}
                    >
                        {({ renderCell }) => (
                            <DataGridCell>{renderCell(item)}</DataGridCell>
                        )}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
    );
};

export default DetailDataGrid;
