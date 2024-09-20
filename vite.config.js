import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        laravel(["resources/js/app.jsx", "resources/css/app.css"]),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
            },
            includeAssets: [
                "favicon.svg",
                "favicon.ico",
                "robots.txt",
                "apple-touch-icon.png",
            ],
            manifest: {
                name: "Inventory App",
                short_name: "Inventory",
                description: "Inventory App",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "public/img/logo_skanka.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "public/img/logo_skanka.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/public/img/logo_skanka.png",
                        sizes: "144x144",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
});
