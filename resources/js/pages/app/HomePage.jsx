import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Head, Link, router, usePage } from "@inertiajs/react";
import ApexCharts from "react-apexcharts";
import Pagination from "@/components/Pagination";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, Check, Loader } from "lucide-react";
import FlashAlert from "@/components/FlashAlert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const STATUS_ORDER = ["pending", "in_progress", "completed"];

const STATUS_META = {
    pending: {
        label: "Tertunda",
        className: "bg-amber-100/80 text-amber-900 border-amber-200",
        icon: Clock,
        color: "#F59E0B",
    },
    in_progress: {
        label: "Sedang Dikerjakan",
        className: "bg-sky-100/80 text-sky-900 border-sky-200",
        icon: Loader,
        color: "#38BDF8",
    },
    completed: {
        label: "Selesai",
        className: "bg-emerald-100/80 text-emerald-900 border-emerald-200",
        icon: CheckCircle,
        color: "#10B981",
    },
};

const DEFAULT_STATS = {
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
};

const buildStats = (stats = {}) => {
    const merged = { ...DEFAULT_STATS, ...stats };
    if (stats.todo) {
        merged.pending += stats.todo;
    }
    return merged;
};

const adjustStatsCounts = (prevStats, fromStatus, toStatus) => {
    const next = { ...prevStats };
    if (fromStatus && next[fromStatus] !== undefined) {
        next[fromStatus] = Math.max(0, (next[fromStatus] ?? 0) - 1);
    }
    if (toStatus && next[toStatus] !== undefined) {
        next[toStatus] = (next[toStatus] ?? 0) + 1;
    }
    return next;
};

export default function HomePage() {
    const { auth, plans, stats, filters, flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");
    const [localStats, setLocalStats] = useState(buildStats(stats));
    const [alert, setAlert] = useState(null);

    const formatDateTime = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    useEffect(() => {
        setLocalStats(buildStats(stats));
    }, [stats]);

    useEffect(() => {
        if (!flash) return;
        if (flash.success) {
            setAlert({ message: flash.success, variant: "success" });
        } else if (flash.error) {
            setAlert({ message: flash.error, variant: "error" });
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("home"),
            { search, status: statusFilter },
            { preserveState: true }
        );
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        router.get(route("home"), { search, status }, { preserveState: true });
    };

    const handleDelete = (plan) => {
        const confirmed = window.confirm(
            `Anda akan menghapus rencana "${plan.title}". Tindakan ini tidak dapat dibatalkan!`
        );

        if (confirmed) {
            router.delete(route("plans.destroy", plan.id));
        }
    };

    const handleToggleComplete = (plan) => {
        const originalStatus = plan.status;
        const newStatus =
            originalStatus === "completed" ? "pending" : "completed";

        const originalStats = { ...localStats };

        router.post(
            route("plans.toggle", plan.id),
            {},
            {
                preserveScroll: true,
                onStart: () => {
                    plan.status = newStatus;
                    setLocalStats((prevStats) =>
                        adjustStatsCounts(prevStats, originalStatus, newStatus)
                    );
                },
                onError: () => {
                    plan.status = originalStatus;
                    setLocalStats(originalStats);
                },
                onSuccess: () => {},
            }
        );
    };

    const chartOptions = {
        chart: {
            type: "donut",
            foreColor: "#e2e8f0",
        },
        labels: STATUS_ORDER.map((status) => STATUS_META[status].label),
        colors: STATUS_ORDER.map((status) => STATUS_META[status].color),
        legend: {
            position: "bottom",
            labels: { colors: "#e2e8f0" },
        },
        stroke: { colors: ["#0f172a"] },
    };
    const chartSeries = STATUS_ORDER.map((status) => localStats[status] ?? 0);

    const statusButtons = [
        { value: "", label: `Semua (${localStats.total ?? 0})` },
        ...STATUS_ORDER.map((status) => ({
            value: status,
            label: `${STATUS_META[status].label} (${localStats[status] ?? 0})`,
        })),
    ];

    const summaryCards = [
        { key: "total", label: "Total Rencana" },
        ...STATUS_ORDER.map((status) => ({
            key: status,
            label: STATUS_META[status].label,
        })),
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <FlashAlert
                text={alert?.message}
                variant={alert?.variant}
                onFinish={() => setAlert(null)}
            />
            <div className="relative px-4 py-10 text-white">
                <section className="mx-auto max-w-6xl space-y-6">
                    <div className="rounded-3xl border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-3">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                                    Dashboard MarshallTodos
                                </p>
                                <h1 className="text-4xl font-semibold leading-tight">
                                    Hai, {auth.user.name}! ✨
                                </h1>
                                <p className="text-white/80">
                                    Selamat datang kembali. Pantau progres
                                    rencana dengan tampilan yang konsisten di
                                    seluruh aplikasi.
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {summaryCards.map((card) => (
                                    <div
                                        key={card.key}
                                        className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center"
                                    >
                                        <p className="text-xs uppercase text-white/70">
                                            {card.label}
                                        </p>
                                        <p className="text-2xl font-semibold">
                                            {localStats[card.key] ?? 0}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <Card className="border border-white/15 bg-white/5 text-white shadow-2xl">
                        <CardHeader>
                            <CardTitle>Statistik Status</CardTitle>
                            <CardDescription className="text-white/70">
                                Komposisi rencana berdasarkan status terbaru.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ApexCharts
                                options={chartOptions}
                                series={chartSeries}
                                type="donut"
                                height={280}
                            />
                        </CardContent>
                    </Card>
                    <Card className="border border-white/15 bg-white/5 text-white shadow-2xl">
                        <CardHeader>
                            <CardTitle>Pencarian & Filter</CardTitle>
                            <CardDescription className="text-white/70">
                                Temukan rencana sesuai kata kunci dan status.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="flex flex-col gap-3 md:flex-row">
                                    <Input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari berdasarkan judul atau konten..."
                                        className="flex-1 border-white/30 bg-white/10 text-white placeholder-white/60"
                                    />
                                    <Button className="w-full bg-white/90 text-slate-900 hover:bg-white md:w-auto">
                                        Cari
                                    </Button>
                                </div>
                            </form>
                            <div className="flex flex-wrap gap-2">
                                {statusButtons.map((button) => (
                                    <Button
                                        key={button.value || "all"}
                                        type="button"
                                        variant={
                                            statusFilter === button.value
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            handleStatusFilter(button.value)
                                        }
                                        className={
                                            statusFilter === button.value
                                                ? "bg-white text-slate-900"
                                                : "border-white/30 bg-transparent text-white hover:bg-white/10"
                                        }
                                    >
                                        {button.label}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="mx-auto mt-10 max-w-6xl border border-white/15 bg-white/5 text-white shadow-2xl">
                    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Daftar Rencanamu</CardTitle>
                            <CardDescription className="text-white/70">
                                Ringkasan semua rencana dengan status terbaru.
                            </CardDescription>
                        </div>
                        <Link href={route("plans.create")}>
                            <Button className="bg-white text-slate-900 hover:bg-white/90">
                                + Buat Rencana
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {plans.data && plans.data.length > 0 ? (
                            <div className="space-y-4">
                                {plans.data.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h4
                                                        className={cn(
                                                            "text-lg font-semibold",
                                                            plan.status ===
                                                                "completed" &&
                                                                "text-white/60 line-through"
                                                        )}
                                                    >
                                                        {plan.title}
                                                    </h4>
                                                    <span className="text-xs">
                                                        {formatDateTime(
                                                            plan.created_at
                                                        )}
                                                    </span>
                                                    <StatusBadge
                                                        status={plan.status}
                                                    />
                                                </div>
                                                <p className="text-sm text-white/80">
                                                    {plan.content}
                                                </p>
                                                {plan.completed_at && (
                                                    <p className="text-xs text-white/60">
                                                        Selesai pada{" "}
                                                        {formatDateTime(
                                                            plan.completed_at
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    aria-label="Toggle status selesai"
                                                    onClick={() =>
                                                        handleToggleComplete(
                                                            plan
                                                        )
                                                    }
                                                    className={cn(
                                                        "size-8 rounded-full border flex items-center justify-center transition-all",
                                                        plan.status ===
                                                            "completed"
                                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                                            : "border-white/40 text-white hover:border-white"
                                                    )}
                                                >
                                                    {plan.status ===
                                                    "completed" ? (
                                                        <Check className="size-4" />
                                                    ) : (
                                                        <span className="text-[10px] font-semibold">
                                                            ✓
                                                        </span>
                                                    )}
                                                </button>
                                                <Link
                                                    href={route(
                                                        "plans.show",
                                                        plan.id
                                                    )}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-white/40 bg-transparent text-white hover:bg-white/10"
                                                    >
                                                        Detail
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "plans.edit",
                                                        plan.id
                                                    )}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-white/40 bg-transparent text-white hover:bg-white/10"
                                                    >
                                                        Ubah
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="border border-rose-200/50 bg-rose-500/80 text-white hover:bg-rose-500"
                                                    onClick={() =>
                                                        handleDelete(plan)
                                                    }
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-4 text-white/80">
                                <p>
                                    Belum ada rencana. Mulai buat rencana
                                    pertama Anda!
                                </p>
                                <Link href={route("plans.create")}>
                                    <Button className="bg-white text-slate-900 hover:bg-white/90">
                                        Buat Rencana Pertama
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {plans.meta?.links && (
                            <Pagination
                                links={plans.meta.links}
                                className="pt-4 border-t border-white/10"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }) {
    const config = STATUS_META[status] ?? STATUS_META.pending;
    const Icon = config.icon;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                config.className
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
}
