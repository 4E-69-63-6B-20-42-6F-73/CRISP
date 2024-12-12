import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    BreadcrumbDivider,
    Field,
    Input,
    Textarea,
    tokens,
} from "@fluentui/react-components";
import { AddFilled, LightbulbFilamentRegular } from "@fluentui/react-icons";
import { useNavigate } from "@/router";
import { makeStyles } from "@fluentui/react-components";
import { FilePicker } from "@/components/FilePicker";
import { useState } from "react";
import { useAddAnalyse } from "@/stores/ApplicationStore";
import extractContent from "@/utils/extractContent";
import SpinnerButton from "@/components/SpinnerButton";
import { expectedColumnInFile } from "@/orders";

import { FileInput } from "@/types";

const useClasses = makeStyles({
    divCreateButton: {
        display: "flex",
        justifyContent: "end",
    },
    divMainContentWrapper: {
        display: "flex",
        justifyContent: "center",
    },
    divMainContent: {
        marginTop: "12px",
        width: "75%",
        maxWidth: "750px",
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalL,
    },
});

type ValidFile = {
    file: File;
    fileName: string;
    content: FileInput[];
    isValid: true;
};

type InvalidFile = {
    file: File;
    fileName: string;
    content: any[];
    isValid: false;
    reason: string;
};

export default function Index() {
    const navigate = useNavigate();
    const classes = useClasses();
    const addAnalyse = useAddAnalyse();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<(ValidFile | InvalidFile)[]>([]);

    async function isValidFile(file: File): Promise<ValidFile | InvalidFile> {
        const content = await extractContent(file);

        if (content.length === 0) {
            return {
                file,
                fileName: file.name,
                content,
                isValid: false,
                reason: "The file is empty.",
            } as InvalidFile;
        }

        const fileColumns = new Set(Object.keys(content[0]));
        const missingColumns = Array.from(expectedColumnInFile).filter(
            (column) => !fileColumns.has(column),
        );

        if (missingColumns.length === 0) {
            return {
                file,
                fileName: file.name,
                content: content as FileInput[],
                isValid: true,
            } as ValidFile;
        } else {
            const formattedMissingColumns =
                missingColumns.length > 2
                    ? `${missingColumns.slice(0, 2).join(", ")}, + ${missingColumns.length - 2} more`
                    : missingColumns.join(", ");
            return {
                file,
                fileName: file.name,
                content,
                isValid: false,
                reason: `Missing columns: ${formattedMissingColumns}`,
            } as InvalidFile;
        }
    }

    const handleCreate = async () => {
        const id = addAnalyse({
            name: name,
            description: description,
            created: new Date(),
            files: files,
        });

        navigate("/predict/:id", { params: { id: id.toString() } });
    };

    return (
        <>
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbButton onClick={() => navigate("/")}>
                        My analyses
                    </BreadcrumbButton>
                </BreadcrumbItem>
                <BreadcrumbDivider />
                <BreadcrumbItem>
                    <BreadcrumbButton current> Create new </BreadcrumbButton>
                </BreadcrumbItem>
            </Breadcrumb>

            <div className={classes.divMainContentWrapper}>
                <div className={classes.divMainContent}>
                    <Field label="Name" required>
                        <Input
                            value={name}
                            onChange={(_, data) => setName(data.value)}
                        />
                    </Field>

                    <Field label="Description">
                        <Textarea
                            value={description}
                            onChange={(_, data) => setDescription(data.value)}
                        />
                    </Field>

                    <FilePicker
                        label="Files"
                        accept=".txt, .csv, .xls, .xlsx, text/plain, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        required
                        onfilechange={(newFiles) => setFiles(newFiles)}
                        isFileValid={isValidFile}
                    />

                    <div
                        style={{
                            border: "dashed",
                            borderColor: "gray",
                            borderWidth: "3px",
                            padding: "8px",
                            borderRadius: "8px",
                            color: "gray",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <LightbulbFilamentRegular fontSize={24} />
                        <div>
                            <span>
                                <b>Hint</b> Use{" "}
                                <a
                                    href="web_model/template.xlsx"
                                    target="_blank"
                                    download
                                >
                                    this template
                                </a>{" "}
                                to make sure you have the right data{" "}
                            </span>
                        </div>
                    </div>
                    <div className={classes.divCreateButton}>
                        <SpinnerButton
                            appearance="primary"
                            icon={<AddFilled />}
                            disabled={
                                name === "" ||
                                files.length === 0 ||
                                files.some((x) => !x.isValid)
                            }
                            onClick={handleCreate}
                        >
                            Create
                        </SpinnerButton>
                    </div>
                </div>
            </div>
        </>
    );
}
