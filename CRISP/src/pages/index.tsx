import { Breadcrumb, BreadcrumbButton, BreadcrumbItem, Button, makeStyles } from "@fluentui/react-components";
import { AddFilled} from "@fluentui/react-icons";
import { useNavigate } from "../router";


const useClasses = makeStyles({
    div:{
        display:"flex",
        gap:"12px"
    },
    button: {
        background: "linear-gradient(128.84deg,#0f6cbd 20.46%,#3c45ab 72.3%)", //TODO use tokens??
        ":hover":{
            background: "linear-gradient(128.84deg, #025caa 20.46%, #222b91 72.3%);"
        }
    },
})

export default function Index() {
    const classes = useClasses()
    const navigate = useNavigate()

    return <div className={classes.div}>
        <Breadcrumb>
            <BreadcrumbItem>
                <BreadcrumbButton current>My analyses</BreadcrumbButton>
            </BreadcrumbItem>
        </Breadcrumb>
        <Button className={classes.button} appearance="primary" shape="circular" icon={<AddFilled />} onClick={() => navigate("/new")}> Create new</Button>
    </div>
}