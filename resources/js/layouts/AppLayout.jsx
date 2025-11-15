import React from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }) {
    const onLogout = () => {
        router.get("/auth/logout");
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),transparent_55%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(30,41,59,0.96))]" />
            <div className="absolute inset-y-0 -right-28 hidden lg:block h-[460px] w-[460px] rounded-full bg-gradient-to-br from-indigo-300/35 to-fuchsia-200/25 blur-[150px]" />
            <div className="absolute inset-y-0 -left-32 hidden lg:block h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-sky-200/30 to-purple-200/20 blur-[150px]" />

            <div className="relative z-10 flex min-h-screen flex-col">
                <nav className="border-b border-white/15 bg-white/5 backdrop-blur">
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between text-white">
                            <Link
                                href="/"
                                className="text-lg font-semibold tracking-wide"
                            >
                                MarshallTodos
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onLogout}
                                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </nav>

                <main className="flex-1">{children}</main>

                <footer className="border-t border-white/15 bg-white/5 py-6">
                    <div className="container mx-auto px-4 text-center text-sm text-white/80">
                        Marshall Manurung &middot; NIM 11S23021
                    </div>
                </footer>
            </div>
        </div>
    );
}
