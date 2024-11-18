import React from "react";
import { createInertiaApp } from "@inertiajs/inertia-react";
import { createRoot } from "react-dom/client";
import ReactQueryProvider from "./components/provider/ReactQueryProvider";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ReactQueryProvider>
                <App {...props} />
            </ReactQueryProvider>
        );
    },
    // onError: (error) => {
    //     if (error.response && error.response.status === 401) {
    //         // Redirect to login page if unauthorized
    //         Inertia.visit("/login");
    //     }
    // },
});
