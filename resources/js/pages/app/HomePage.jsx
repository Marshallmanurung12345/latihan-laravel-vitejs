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
    if (stats.todo) merged.pending += stats.todo;
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
        if (confirmed) router.delete(route("plans.destroy", plan.id));
    };

    const handleToggleComplete = (plan) => {
        const originalStatus = plan.status;
        const newStatus = originalStatus === "completed" ? "pending" : "completed";
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
            }
        );
    };

    const chartOptions = {
        chart: { type: "donut", foreColor: "#1e293b" },
        labels: STATUS_ORDER.map((status) => STATUS_META[status].label),
        colors: STATUS_ORDER.map((status) => STATUS_META[status].color),
        legend: { position: "bottom", labels: { colors: "#0f172a" } },
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
        ...STATUS_ORDER.map((status) => ({ key: status, label: STATUS_META[status].label })),
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <FlashAlert
                text={alert?.message}
                variant={alert?.variant}
                onFinish={() => setAlert(null)}
            />

            <div className="bg-slate-50/90">
                <div className="container mx-auto px-4 py-10 space-y-8">
                    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-3">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                    Dashboard
                                </p>
                                <h1 className="text-3xl font-semibold leading-tight text-slate-900">
                                    Hai, {auth.user.name}! ✨
                                </h1>
                                <p className="text-sm text-slate-600">
                                    Selamat datang kembali. Pantau progres rencana dengan warna yang konsisten dan ramah mata.
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {summaryCards.map((card) => (
                                    <div
                                        key={card.key}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                    >
                                        <p className="text-xs uppercase text-slate-500">
                                            {card.label}
                                        </p>
                                        <p className="text-2xl font-semibold text-slate-900">
                                            {localStats[card.key] ?? 0}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <Card className="border border-slate-200 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle>Statistik Status</CardTitle>
                                <CardDescription>
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

                        <Card className="border border-slate-200 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle>Pencarian & Filter</CardTitle>
                                <CardDescription>
                                    Temukan rencana sesuai kata kunci dan status.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="flex flex-col gap-3 md:flex-row">
                                        <Input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari berdasarkan judul atau konten..."
                                            className="flex-1"
                                        />
                                        <Button className="w-full md:w-auto">Cari</Button>
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
                                            onClick={() => handleStatusFilter(button.value)}
                                        >
                                            {button.label}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border border-slate-200 bg-white shadow-sm">
                        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Daftar Rencanamu</CardTitle>
                                <CardDescription>
                                    Ringkasan semua rencana dengan status terbaru.
                                </CardDescription>
                            </div>
                            <Link href={route("plans.create")}>
                                <Button className="bg-slate-900 text-white hover:bg-slate-800">
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
                                            className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                                        >
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h4
                                                            className={cn(
                                                                "text-lg font-semibold",
                                                                plan.status === "completed" &&
                                                                    "text-slate-500 line-through"
                                                            )}
                                                        >
                                                            {plan.title}
                                                        </h4>
                                                        <StatusBadge status={plan.status} />
                                                    </div>
                                                    <p className="text-sm text-slate-600">
                                                        {plan.content}
                                                    </p>
                                                    <div className="space-y-1 text-xs text-slate-500">
                                                        <p>
                                                            Ditambahkan pada: {formatDateTime(plan.created_at)}
                                                        </p>
                                                        {plan.completed_at && (
                                                            <p>
                                                                Selesai pada: {formatDateTime(plan.completed_at)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleComplete(plan)}
                                                        className={cn(
                                                            "size-8 rounded-full border flex items-center justify-center transition-all",
                                                            plan.status === "completed"
                                                                ? "bg-emerald-500 border-emerald-500 text-white"
                                                                : "border-slate-200 text-slate-500 hover:border-slate-400"
                                                        )}
                                                    >
                                                        {plan.status === "completed" ? (
                                                            <Check className="size-4" />
                                                      