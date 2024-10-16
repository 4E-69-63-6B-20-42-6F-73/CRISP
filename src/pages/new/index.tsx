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
import { Link } from "react-router-dom";

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

export default function Index() {
    const navigate = useNavigate();
    const classes = useClasses();
    const addAnalyse = useAddAnalyse();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const handleCreate = async () => {
        const id = addAnalyse({
            name: name,
            description: description,
            created: new Date(),
            files: await Promise.all(
                files.map(async (x) => ({
                    file: x,
                    fileName: x.name,
                    content: await extractContent(x),
                })),
            ),
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
                            <b>Hint</b> Use{" "}
                            <Link
                                to="/web_model/template.xlsx"
                                target="_blank"
                                download
                            >
                                this template
                            </Link>{" "}
                            to make sure you have the right data
                        </div>
                    </div>
                    <div className={classes.divCreateButton}>
                        <SpinnerButton
                            appearance="primary"
                            icon={<AddFilled />}
                            disabled={name === "" || files.length === 0}
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
