import * as React from "react";
import { useRef, useState } from "react";
import {
    TagPicker,
    TagPickerInput,
    TagPickerControl,
    TagPickerGroup,
    Button,
} from "@fluentui/react-components";
import { Tag, Field, Tooltip } from "@fluentui/react-components";
import {
    AttachFilled,
    WarningFilled,
    CheckmarkFilled,
    ClockFilled,
} from "@fluentui/react-icons";
import { tokens } from "@fluentui/react-theme";

type ValidFile = {
    file: File;
    fileName: string;
    content: any[];
    isValid: true;
};

type PendingFile = {
    file: File;
    fileName: string;
    content: any[];
    isValid: false;
    reason: "Processing";
};

type InvalidFile = {
    file: File;
    fileName: string;
    content: any[];
    isValid: false;
    reason: string;
};

interface FilePickerProps {
    required?: boolean;
    accept?: string;
    label?: string;
    onfilechange?: (newFiles: (ValidFile | InvalidFile)[]) => void;
    isFileValid: (file: File) => Promise<ValidFile | InvalidFile>;
}

export const FilePicker: React.FC<FilePickerProps> = ({
    required = false,
    accept = "",
    label = "Files",
    onfilechange,
    isFileValid,
}) => {
    const fileUploader = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<
        (ValidFile | InvalidFile | PendingFile)[]
    >([]);

    const handleAddClick = () => {
        if (fileUploader.current) {
            fileUploader.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            const updatedFiles = [...selectedFiles];
            const seenNames = new Set(updatedFiles.map((f) => f.fileName));

            for (const file of newFiles) {
                if (!seenNames.has(file.name)) {
                    seenNames.add(file.name);
                    updatedFiles.push({
                        file,
                        fileName: file.name,
                        content: [],
                        isValid: false,
                        reason: "Processing",
                    } as PendingFile);
                }
            }
            processFiles(updatedFiles);
        }
    };

    const processFiles = async (
        files: (ValidFile | InvalidFile | PendingFile)[],
    ) => {
        let updatedFiles = [...files];

        // Here we set all the files as pending
        setSelectedFiles(updatedFiles);
        for (const file of files) {
            const validatedFile = await isFileValid(file.file);

            updatedFiles = updatedFiles.map((f) =>
                f.fileName === validatedFile.fileName ? validatedFile : f,
            );
        }
        // Here we know if they are valid or not
        setSelectedFiles(updatedFiles);
        onfilechange && onfilechange(updatedFiles);
    };

    const handleRemoveFile = (
        fileToRemove: ValidFile | InvalidFile | PendingFile,
    ) => {
        const updatedFiles = selectedFiles.filter(
            (file) => file.fileName !== fileToRemove.fileName,
        );
        setSelectedFiles(updatedFiles);
        onfilechange && onfilechange(updatedFiles);
    };

    function renderPendingFile(file: PendingFile): JSX.Element {
        return (
            <Tag
                key={file.fileName}
                shape="rounded"
                value={file.fileName}
                icon={<ClockFilled />}
            >
                {file.fileName}
            </Tag>
        );
    }

    function renderValidFile(file: ValidFile): JSX.Element {
        return (
            <Tag
                key={file.fileName}
                onClick={() => handleRemoveFile(file)}
                shape="rounded"
                value={file.fileName}
                icon={
                    <CheckmarkFilled
                        style={{
                            color: tokens.colorPaletteGreenForeground1,
                        }}
                    />
                }
            >
                {file.fileName}
            </Tag>
        );
    }

    function renderInvalidFile(file: InvalidFile): JSX.Element {
        return (
            <Tooltip
                key={file.fileName}
                content={file.reason}
                relationship="label"
            >
                <Tag
                    onClick={() => handleRemoveFile(file)}
                    shape="rounded"
                    value={file.fileName}
                    icon={
                        <WarningFilled
                            style={{
                                color: tokens.colorPaletteRedForeground1,
                            }}
                        />
                    }
                >
                    {file.fileName}
                </Tag>
            </Tooltip>
        );
    }

    return (
        <Field label={label} required={required}>
            <input
                type="file"
                ref={fileUploader}
                onChange={handleFileChange}
                multiple
                style={{ display: "none" }}
                accept={accept}
            />

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <TagPicker noPopover selectedOptions={[""]}>
                    <TagPickerControl style={{ width: "100%" }}>
                        <TagPickerGroup aria-label="Selected Files">
                            {selectedFiles.map((file) => {
                                if (
                                    (file as PendingFile).reason ===
                                    "Processing"
                                ) {
                                    return renderPendingFile(
                                        file as PendingFile,
                                    );
                                }
                                return file.isValid
                                    ? renderValidFile(file as ValidFile)
                                    : renderInvalidFile(file as InvalidFile);
                            })}
                        </TagPickerGroup>
                        <TagPickerInput
                            aria-label="Select Files"
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Backspace" &&
                                    e.currentTarget.value === ""
                                ) {
                                    if (selectedFiles.length > 0) {
                                        handleRemoveFile(
                                            selectedFiles[
                                                selectedFiles.length - 1
                                            ],
                                        );
                                    }
                                }
                            }}
                            onClick={handleAddClick}
                        />
                    </TagPickerControl>
                </TagPicker>

                <Button
                    icon={<AttachFilled />}
                    appearance="transparent"
                    onClick={handleAddClick}
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        marginRight: "8px",
                    }}
                />
            </div>
        </Field>
    );
};
