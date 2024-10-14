import { makeStyles, tokens } from "@fluentui/react-components";
import { Link } from "@/router";

const useClasses = makeStyles({
    h1: {
        color: "white",
        fontWeight: tokens.fontWeightSemibold,
    },

    div: {
        backgroundColor: tokens.colorBrandBackground,
        height: "48px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "24px",
    },
});

export default function AppBar() {
    const classes = useClasses();

    return (
        <div className={classes.div}>
            <Link style={{ textDecoration: "none" }} to={"/"}>
                {" "}
                <h1 className={classes.h1}> CRISP </h1>{" "}
            </Link>
        </div>
    );
}
