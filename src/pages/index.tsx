import {
    Breadcrumb,
    BreadcrumbButton,
    BreadcrumbItem,
    Button,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import { AddFilled } from "@fluentui/react-icons";
import { useNavigate } from "../router";
import { useAnalyses } from "../stores/ApplicationStore";
import AnalyseDataGrid from "../components/index/analysesDatagrid";

const useClasses = makeStyles({
    div: {
        display: "flex",
        gap: "12px",
    },
    button: {
        background: "linear-gradient(128.84deg,#0f6cbd 20.46%,#3c45ab 72.3%)", //TODO use tokens??
        ":hover": {
            background:
                "linear-gradient(128.84deg, #025caa 20.46%, #222b91 72.3%);",
        },
    },
    datagrid: {
        maxWidth: "1000px",
        width: "-webkit-fill-available",
        background: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        padding: "12px",
        marginTop: "12px",
    },
});

export default function Index() {
    const classes = useClasses();
    const navigate = useNavigate();
    const analyses = useAnalyses();

    return (
        <>
            <div className={classes.div}>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbButton current>My analyses</BreadcrumbButton>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Button
                    className={classes.button}
                    appearance="primary"
                    shape="circular"
                    icon={<AddFilled />}
                    onClick={() => navigate("/new")}
                >
                    Create new
                </Button>
            </div>

            {analyses.length !== 0 ? (
                <div className={classes.datagrid}>
                    <AnalyseDataGrid items={analyses} />
                </div>
            ) : (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <p>No analyses yet. Use Create new to create a new one!</p>
                </div>
            )}
        </>
    );
}
