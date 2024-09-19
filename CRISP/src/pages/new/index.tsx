import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider, Field, Input, Textarea, Button, tokens } from "@fluentui/react-components";
import { AddFilled } from "@fluentui/react-icons";

import { useNavigate } from "../../router";

import { makeStyles } from '@fluentui/react-components';

const useClasses = makeStyles({
  divCreateButton: {
    display: "flex",
    justifyContent: "end"
  },
  divMainContentWrapper: {
    display: "flex",
    justifyContent: "center"
  },
  divMainContent: {
    marginTop: "12px",
    width: "75%",
    maxWidth:"750px",
    display:"flex",
    flexDirection:"column",
    gap: tokens.spacingVerticalL
  }
});

export default function Index() {
  const navigate = useNavigate()
  const classes = useClasses()
  return <>
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbButton onClick={() => navigate("/")}>My analyses</BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton current> Create new </BreadcrumbButton>
      </BreadcrumbItem>
    </Breadcrumb>

    <div className={classes.divMainContentWrapper}>
      <div className={classes.divMainContent}>
        <Field label="Name" required>
          <Input />
        </Field>

        <Field label="Description">
          <Textarea />
        </Field>

        <Field label="Files" required>
          <Input />
        </Field>

        <div className={classes.divCreateButton}>
          <Button appearance="primary" icon={<AddFilled />} >Create</Button>
        </div>
      </div>
    </div>
  </>
}