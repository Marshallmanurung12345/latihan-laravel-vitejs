import React from "react";

export default function AuthLayout({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.28),transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.22),transparent_60%)]" />
            <div className="absolute inset-y-0 -right-24 hidden lg:block h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-500/40 to-fuchsia-500/30 blur-3xl opacity-60" />
            <div className="absolute inset-y-0 -left-32 hidden lg:block h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-500/30 to-purple-500/20 blur-3xl opacity-60" />
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <main className="w-full max-w-6xl">{children}</main>
            </div>
        </div>
    );
}
