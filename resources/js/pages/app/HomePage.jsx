import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Head, Link, router, usePage } from "@inertiajs/react";
import ApexCharts from "react-apexcharts";
import Pagination from "@/components/Pagination";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, Check, Loader } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HomePage() {
    const { auth, plans, stats, filters, flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");
    const [localStats, setLocalStats] = useState(stats);

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
        setLocalStats(stats);
    }, [stats]);

    useEffect(() => {
        if (!flash) return;

        if (flash.success) {
            window.alert(`Berhasil!\n${flash.success}`);
        } else if (flash.error) {
            window.alert(`Gagal!\n${flash.error}`);
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

        // Simpan stats asli untuk rollback jika terjadi error
        const originalStats = { ...localStats };

        // Optimistic update
        router.post(
            route("plans.toggle", plan.id),
            {},
            {
                preserveScroll: true,
                // Langsung perbarui UI sebelum server merespons
                onStart: () => {
                    // 1. Ubah status item rencana secara visual
                    plan.status = newStatus;
                    // 2. Perbarui statistik secara lokal
                    setLocalStats((prevStats) => {
                        const newCompleted =
                            newStatus === "completed"
                                ? prevStats.completed + 1
                                : prevStats.completed - 1;
                        const newPending = prevStats.total - newCompleted;
                        return {
                            ...prevStats,
                            completed: newCompleted,
                            pending: newPending,
                        };
                    });
                },
                // Jika gagal, kembalikan semua ke state semula
                onError: () => {
                    // Jika gagal, kembalikan ke status semula
                    plan.status = originalStatus;
                    setLocalStats(originalStats); // Kembalikan juga statistik
                },
                onSuccess: () => {
                    // Jangan lakukan apa-apa, karena kita sudah memperbarui stats secara optimis.
                },
            }
        );
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                label: "Tertunda",
                className: "bg-yellow-100 text-yellow-800 border-yellow-300",
                icon: Clock,
            },
            in_progress: {
                label: "Sedang Dikerjakan",
                className: "bg-blue-100 text-blue-800 border-blue-300",
                icon: Loader,
            },
            completed: {
                label: "Selesai",
                className: "bg-green-100 text-green-800 border-green-300",
                icon: CheckCircle,
            },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                    config.className
                )}
            >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        );
    };

    const chartOptions = {
        chart: {
            type: "donut",
        },
        labels: ["Tertunda", "Selesai"],
        colors: ["#F59E0B", "#10B981"], // Warna untuk Tertunda, Selesai
        legend: {
            position: "bottom",
        },
    };
    const chartSeries = [localStats.pending ?? 0, localStats.completed ?? 0];

    const statusButtons = [
        { value: "", label: `Semua (${localStats.total ?? 0})` },
        { value: "pending", label: `Tertunda (${localStats.pending ?? 0})` },
        { value: "completed", label: `Selesai (${localStats.completed ?? 0})` },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="bg-muted/30">
                <div className="container mx-auto px-4 py-10 space-y-8">
                    <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 shadow-xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                                Dashboard
                            </p>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold leading-tight">
                                    Hai, {auth.user.name}! ✨
                                </h1>
                                <p className="text-white/80 max-w-2xl">
                                    Selamat datang kembali. Pantau progres
                                    rencana dan selesaikan prioritasmu dengan
                                    lebih terstruktur.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                                    <p className="text-xs uppercase text-white/70">
                                        Total rencana
                                    </p>
                                    <p className="text-2xl font-semibold">
                                        {localStats.total ?? 0}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                                    <p className="text-xs uppercase text-white/70">
                                        Selesai
                                    </p>
                                    <p className="text-2xl font-semibold">
                                        {localStats.completed ?? 0}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                                    <p className="text-xs uppercase text-white/70">
                                        Tertunda
                                    </p>
                                    <p className="text-2xl font-semibold">
                                        {localStats.pending ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur w-full max-w-sm space-y-4">
                            <p className="text-sm text-white/80">
                                Mulai rencana baru dalam hitungan detik.
                            </p>
                            <Link href={route("plans.create")}>
                                <Button className="w-full bg-white text-blue-600 hover:bg-white/90">
                                    + Buat Rencana
                                </Button>
                            </Link>
                        </div>
                    </section>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Statistik Status</CardTitle>
                                <CardDescription>
                                    Komposisi rencana berdasarkan status.
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
                        <Card className="shadow-md lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Pencarian & Filter</CardTitle>
                                <CardDescription>
                                    Temukan rencana sesuai kata kunci dan
                                    status.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form
                                    onSubmit={handleSearch}
                                    className="space-y-4"
                                >
                                    <div className="flex flex-col gap-3 md:flex-row">
                                        <Input
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Cari berdasarkan judul atau konten..."
                                            className="flex-1"
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full md:w-auto"
                                        >
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
                                        >
                                            {button.label}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Daftar Rencanamu</CardTitle>
                                <CardDescription>
                                    Ringkasan semua rencana dengan status
                                    terbaru.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {plans.data && plans.data.length > 0 ? (
                                <div className="space-y-4">
                                    {plans.data.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className="rounded-xl border border-border/60 bg-card/60 p-4 transition hover:shadow-md"
                                        >
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h4
                                                            className={cn(
                                                                "text-lg font-semibold transition-all",
                                                                plan.status ===
                                                                    "completed" &&
                                                                    "text-muted-foreground line-through"
                                                            )}
                                                        >
                                                            {plan.title}
                                                        </h4>
                                                        {getStatusBadge(
                                                            plan.status
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {plan.content}
                                                    </p>
                                                    <div className="space-y-1 text-xs text-muted-foreground">
                                                        <p>
                                                            Ditambahkan pada:{" "}
                                                            {formatDateTime(
                                                                plan.created_at
                                                            )}
                                                        </p>
                                                        {plan.completed_at && (
                                                            <p>
                                                                Selesai pada:{" "}
                                                                {formatDateTime(
                                                                    plan.completed_at
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
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
                                                                ? "bg-green-500 border-green-500 text-white"
                                                                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
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
                                                            variant="default"
                                                            size="sm"
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
                                                        >
                                                            Ubah
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
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
                                <div className="text-center py-12 space-y-4">
                                    <p className="text-muted-foreground">
                                        Belum ada rencana. Mulai buat rencana
                                        pertama Anda!
                                    </p>
                                    <Link href={route("plans.create")}>
                                        <Button>Buat Rencana Pertama</Button>
                                    </Link>
                                </div>
                            )}
                            {plans.meta?.links && (
                                <Pagination
                                    links={plans.meta.links}
                                    className="pt-4 border-t"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
