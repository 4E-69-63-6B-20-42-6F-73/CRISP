import React from 'react';
import { DataGrid, DataGridHeader, DataGridBody, DataGridRow, DataGridCell, DataGridHeaderCell, TableColumnDefinition, createTableColumn, TableCellLayout } from '@fluentui/react-components';
import { Analyse } from '../../types';

const AnalyseDataGrid: React.FC<{ items: Analyse[] }> = ({ items }) => {
    const columns: TableColumnDefinition<Analyse>[] = [
        createTableColumn<Analyse>({
            columnId: "name",
            compare: (a, b) => a.name.localeCompare(b.name),
            renderHeaderCell: () => "Name",
            renderCell: (item) => <TableCellLayout>{item.name}</TableCellLayout>,
        }),
        createTableColumn<Analyse>({
            columnId: "description",
            compare: (a, b) => a.description.localeCompare(b.description),
            renderHeaderCell: () => "Description",
            renderCell: (item) => <TableCellLayout>{item.description}</TableCellLayout>,
        }),
        createTableColumn<Analyse>({
            columnId: "date",
            compare: (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
            renderHeaderCell: () => "Date",
            renderCell: (item) => <TableCellLayout>{item.created.toDateString()}</TableCellLayout>,
        }),
        createTableColumn<Analyse>({
            columnId: "files",
            compare: (a, b) => a.files.length - b.files.length, // Example comparison
            renderHeaderCell: () => "Files",
            renderCell: (item) => (
                <TableCellLayout>
                    {item.files.map(file => (
                        <div key={file.name}>
                            <TableCellLayout media={""}>{file.name}</TableCellLayout>
                        </div>
                    ))}
                </TableCellLayout>
            ),
        }),
    ];

    return (
        <DataGrid
            items={items}
            columns={columns}
            sortable
            getRowId={(item) => item.name} // Use 'name' or another unique property
            focusMode="composite"
            style={{ minWidth: "550px" }}
        >
            <DataGridHeader>
                <DataGridRow
                //   selectionCell={{
                //     checkboxIndicator: { "aria-label": "Select all rows" },
                //   }}
                >
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody<Analyse>>
                {({ item, rowId }) => (
                    <DataGridRow<Analyse>
                        key={rowId}
                    // selectionCell={{
                    //   checkboxIndicator: { "aria-label": "Select row" },
                    // }}
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

export default AnalyseDataGrid;
