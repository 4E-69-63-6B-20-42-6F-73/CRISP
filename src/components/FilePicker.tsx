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
} from "@fluentui/react-icons";

type ValidFile = {
    file: File;
    fileName: string;
    content: any[];
    isValid: true;
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
        (ValidFile | InvalidFile)[]
    >([]);

    const handleAddClick = () => {
        if (fileUploader.current) {
            fileUploader.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            // Deduplicate by file name
            const updatedFiles = [...selectedFiles];
            const seenNames = new Set(updatedFiles.map((f) => f.fileName));
            for (const file of newFiles) {
                if (!seenNames.has(file.name)) {
                    seenNames.add(file.name);
                    const validatedFile = await isFileValid(file);
                    updatedFiles.push(validatedFile);
                }
            }

            setSelectedFiles(updatedFiles);
            onfilechange && onfilechange(updatedFiles);
        }
    };

    const handleRemoveFile = (fileToRemove: ValidFile | InvalidFile) => {
        const updatedFiles = selectedFiles.filter(
            (file) => file.fileName !== fileToRemove.fileName,
        );
        setSelectedFiles(updatedFiles);
        onfilechange && onfilechange(updatedFiles);
    };

    function renderValidFile(file: ValidFile): any {
        return (
            <>
                <Tag
                    onClick={() => {
                        const newFiles = selectedFiles.filter(
                            (x) => x !== file,
                        );
                        setSelectedFiles(newFiles);
                        onfilechange && onfilechange(newFiles); // Call onfilechange when a file is removed
                    }}
                    key={file.fileName}
                    shape="rounded"
                    value={file.fileName}
                    icon={
                        <CheckmarkFilled
                            aria-label="Invalid file"
                            style={{ color: "greem" }}
                        />
                    }
                >
                    {file.fileName}
                </Tag>
            </>
        );
    }
    function renderInvalidFile(file: InvalidFile): any {
        return (
            <>
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
                                aria-label="Invalid file"
                                style={{ color: "orange" }}
                            />
                        }
                    >
                        {file.fileName}
                    </Tag>
                </Tooltip>
            </>
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
                            {selectedFiles.map((file) =>
                                file.isValid
                                    ? renderValidFile(file as ValidFile)
                                    : renderInvalidFile(file as InvalidFile),
                            )}
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
