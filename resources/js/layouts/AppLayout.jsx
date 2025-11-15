import React from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }) {
    const onLogout = () => {
        router.get("/auth/logout");
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.28),transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.22),transparent_60%)]" />
            <div className="absolute inset-y-0 -right-32 hidden lg:block h-[560px] w-[560px] rounded-full bg-gradient-to-br from-indigo-500/35 to-fuchsia-500/25 blur-3xl opacity-70" />
            <div className="absolute inset-y-0 -left-40 hidden lg:block h-[460px] w-[460px] rounded-full bg-gradient-to-tr from-sky-500/25 to-purple-500/20 blur-3xl opacity-70" />

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

                <footer className="border-t border-white/15 bg-white/5 py-6 text-white/80">
                    <div className="container mx-auto px-4 text-center text-sm">
                        Marshall Manurung &middot; NIM 11S23021
                    </div>
                </footer>
            </div>
        </div>
    );
}
