import * as React from "react";
import { useRef, useState } from "react";
import {
    TagPicker,
    TagPickerInput,
    TagPickerControl,
    TagPickerGroup,
    Button,
} from "@fluentui/react-components";
import { Tag, Avatar, Field } from "@fluentui/react-components";
import { AttachFilled } from "@fluentui/react-icons";

interface FilePickerProps {
    required?: boolean;
    accept?: string;
    label?: string;
    onfilechange?: (newFiles: File[]) => void;
}

export const FilePicker: React.FC<FilePickerProps> = ({
    required = false,
    accept = "",
    label = "Files",
    onfilechange,
}) => {
    const fileUploader = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleAddClick = () => {
        if (fileUploader.current) {
            fileUploader.current.click();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && e.currentTarget.value === "") {
            if (selectedFiles.length > 0) {
                const newFiles = selectedFiles.slice(0, -1);
                setSelectedFiles(newFiles);
                onfilechange && onfilechange(newFiles); // Call onfilechange when files are updated
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = [
                ...new Set(selectedFiles.concat(Array.from(e.target.files))),
            ];
            setSelectedFiles(newFiles);
            onfilechange && onfilechange(newFiles);
        }
    };

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
                            {selectedFiles.map((file) => (
                                <Tag
                                    onClick={() => {
                                        const newFiles = selectedFiles.filter(
                                            (x) => x !== file,
                                        );
                                        setSelectedFiles(newFiles);
                                        onfilechange && onfilechange(newFiles); // Call onfilechange when a file is removed
                                    }}
                                    key={file.name}
                                    shape="rounded"
                                    media={
                                        <Avatar
                                            aria-hidden
                                            initials={file.name
                                                .split(".")
                                                .pop()}
                                            color="colorful"
                                        />
                                    }
                                    value={file.name}
                                >
                                    {file.name}
                                </Tag>
                            ))}
                        </TagPickerGroup>
                        <TagPickerInput
                            aria-label="Select Files"
                            onKeyDown={handleKeyDown}
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
