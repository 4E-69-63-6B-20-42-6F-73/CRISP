import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "@generouted/react-router";
import { createHashRouter, RouterProvider } from "react-router-dom";

import "./main.css";
import { useHasLoaded } from "./stores/ApplicationStore";

const router = createHashRouter(routes);

const LoadingCheck = () => {
    const hasLoaded = useHasLoaded();

    if (!hasLoaded) {
        return <p>Loading...</p>;
    }

    return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LoadingCheck />
    </StrictMode>,
);
