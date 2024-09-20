import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Field,
  Input,
  Textarea,
  Button,
  tokens,
} from "@fluentui/react-components";
import { AddFilled } from "@fluentui/react-icons";
import { useNavigate } from "../../router";
import { makeStyles } from "@fluentui/react-components";
import { FilePicker } from "../../components/FilePicker";
import { useState } from "react";
import { useAddAnalyse } from "../../stores/ApplicationStore";

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

  const handleCreate = () => {
    const id = addAnalyse({
      name: name,
      description: description,
      created: new Date(Date.now()),
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
            <Input value={name} onChange={(_, data) => setName(data.value)} />
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

          <div className={classes.divCreateButton}>
            <Button
              appearance="primary"
              icon={<AddFilled />}
              disabled={name === "" || files.length === 0}
              onClick={handleCreate}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
