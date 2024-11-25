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
    Button,
    makeStyles,
} from "@fluentui/react-components";
import { Delete24Regular } from "@fluentui/react-icons";
import { Analyse } from "../../types";
import { useNavigate } from "../../router";
import { useRemoveAnalyseWithToast } from "./removeAnalyseWithToast";

const useClasses = makeStyles({
    row: {
        ":hover": {
            "& button": {
                visibility: "visible",
                opacity: 1,
            },
        },
    },
    deleteButton: {
        visibility: "hidden",
        opacity: 0,
        transition: "visibility 0.1s, opacity 0.1s ease-in-out",
    },
});

const AnalyseDataGrid: React.FC<{ items: Analyse[] }> = ({ items }) => {
    const removeAnalyseWithToast = useRemoveAnalyseWithToast();
    const classes = useClasses();

    const navigate = useNavigate();

    const handleRowClick = (id: number) => {
        navigate("/detail/:id", { params: { id: id.toString() } });
    };

    const handleRemoveClick = (
        event: React.MouseEvent,
        id: number,
        name: string,
    ) => {
        event.stopPropagation();
        removeAnalyseWithToast(id, name);
    };

    const columns: TableColumnDefinition<Analyse>[] = [
        createTableColumn<Analyse>({
            columnId: "actions",
            renderHeaderCell: () => "",
            renderCell: (item) => (
                <TableCellLayout style={{ maxWidth: "50px" }}>
                    <Button
                        className={classes.deleteButton}
                        appearance="subtle"
                        icon={<Delete24Regular />}
                        onClick={(event) =>
                            handleRemoveClick(event, item.id, item.name)
                        }
                        aria-label={`Delete ${item.name}`}
                    />
                </TableCellLayout>
            ),
        }),
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
            resizableColumns
            resizableColumnsOptions={{ autoFitColumns: true }}
            columnSizingOptions={{
                actions: {
                    idealWidth: 32,
                    defaultWidth: 32,
                },
            }}
            items={items}
            columns={columns}
            sortable
            getRowId={(item) => item.id.toString()} // Use a unique property like 'id'
            focusMode="composite"
            style={{ minWidth: "550px" }}
        >
            <DataGridHeader>
                <DataGridRow className={classes.row}>
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
                        className={classes.row}
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
