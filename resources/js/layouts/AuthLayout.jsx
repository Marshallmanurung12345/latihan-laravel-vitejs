import React from "react";

export default function AuthLayout({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-900 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),transparent_55%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(30,41,59,0.95))]" />
            <div className="absolute inset-y-0 -right-24 hidden lg:block h-[440px] w-[440px] rounded-full bg-gradient-to-br from-indigo-400/35 to-fuchsia-300/20 blur-[140px] opacity-70" />
            <div className="absolute inset-y-0 -left-24 hidden lg:block h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-sky-300/25 to-purple-200/15 blur-[140px] opacity-70" />
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <main className="w-full max-w-6xl">{children}</main>
            </div>
        </div>
    );
}
