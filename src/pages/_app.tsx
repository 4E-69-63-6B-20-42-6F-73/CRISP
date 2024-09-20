import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { Outlet } from "react-router-dom";
import AppBar from "../components/Appbar";

import { makeStyles } from "@fluentui/react-components";

const useClasses = makeStyles({
  div: {
    padding: "24px",
  },
});

export default function App() {
  const classes = useClasses();
  return (
    <FluentProvider theme={webLightTheme}>
      <AppBar />
      <div className={classes.div}>
        <Outlet />
      </div>
    </FluentProvider>
  );
}
