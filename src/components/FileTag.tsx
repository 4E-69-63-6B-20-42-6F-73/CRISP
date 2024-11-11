import { Tag, Avatar } from "@fluentui/react-components";

interface FileTagProps {
    fileName: string;
    size?: "extra-small" | "small" | "medium";
}

export default function FileTag({ fileName, size = "medium" }: FileTagProps) {
    return (
        <Tag
            key={fileName}
            size={size}
            shape="rounded"
            media={
                <Avatar
                    aria-hidden
                    initials={fileName.split(".").pop()?.toUpperCase() || ""}
                    color="colorful"
                />
            }
            value={fileName}
        >
            {fileName}
        </Tag>
    );
}
