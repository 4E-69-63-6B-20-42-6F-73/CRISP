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
    TagGroup,
    Tag,
    Avatar,
} from "@fluentui/react-components";
import { Analyse } from "../../types";
import { useNavigate } from "../../router";

const AnalyseDataGrid: React.FC<{ items: Analyse[] }> = ({ items }) => {
    const navigate = useNavigate();
    const handleRowClick = (id: number) => {
        navigate("/detail/:id", { params: { id: id.toString() } });
    };

    const columns: TableColumnDefinition<Analyse>[] = [
        createTableColumn<Analyse>({
            columnId: "name",
            compare: (a, b) => a.name.localeCompare(b.name),
            renderHeaderCell: () => "Name",
            renderCell: (item) => (
                <TableCellLayout>{item.name}</TableCellLayout>
            ),
        }),
        createTableColumn<Analyse>({
            columnId: "description",
            compare: (a, b) => a.description.localeCompare(b.description),
            renderHeaderCell: () => "Description",
            renderCell: (item) => (
                <TableCellLayout>{item.description}</TableCellLayout>
            ),
        }),
        createTableColumn<Analyse>({
            columnId: "date",
            compare: (a, b) =>
                new Date(a.created).getTime() - new Date(b.created).getTime(),
            renderHeaderCell: () => "Date",
            renderCell: (item) => (
                <TableCellLayout>
                    {new Date(item.created).toDateString()}
                </TableCellLayout>
            ),
        }),
        createTableColumn<Analyse>({
            columnId: "files",
            compare: (a, b) => a.files.length - b.files.length,
            renderHeaderCell: () => "Files",
            renderCell: (item) => (
                <TableCellLayout>
                    <TagGroup>
                        {item.files.map((x) => (
                            <Tag
                                key={x.fileName}
                                shape="rounded"
                                media={
                                    <Avatar
                                        aria-hidden
                                        initials={x.fileName.split(".").pop()}
                                        color="colorful"
                                    />
                                }
                                value={x.fileName}
                            >
                                {x.fileName}
                            </Tag>
                        ))}
                    </TagGroup>
                </TableCellLayout>
            ),
        }),
    ];

    return (
        <DataGrid
            items={items}
            columns={columns}
            sortable
            getRowId={(item) => item.id.toString()} // Use a unique property like 'id'
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
            <DataGridBody<Analyse>>
                {({ item, rowId }) => (
                    <DataGridRow<Analyse>
                        key={rowId} // Use unique rowId
                        onClick={() => handleRowClick(item.id)}
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

export default AnalyseDataGrid;
