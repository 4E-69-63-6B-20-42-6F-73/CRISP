import { Tag, Avatar } from "@fluentui/react-components";

interface ToggableTagProps {
    onClick?: () => void;
    text: string;
    isSelected: boolean;
    order?: number;
}

export function ToggableTag({
    onClick,
    isSelected,
    text,
    order,
}: ToggableTagProps) {
    if (isSelected) {
        return (
            <Tag
                appearance="brand"
                media={<Avatar color="brand" initials={order} />}
                onClick={onClick}
                style={{ cursor: "pointer" }}
            >
                {text}
            </Tag>
        );
    }
    return (
        <Tag onClick={onClick} style={{ cursor: "pointer" }}>
            {text}
        </Tag>
    );
}
