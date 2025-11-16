import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

// ⬇️ PENTING: pakai named export, bukan default
import { route } from "ziggy-js";
window.route = route; // bikin global, biar bisa dipakai di semua JSX

createInertiaApp({
    title: (title) => `${title} - My App`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: { color: "#4B5563" },
});

