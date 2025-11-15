import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Head, Link, router, usePage } from "@inertiajs/react";
import ApexCharts from "react-apexcharts";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, Loader } from "lucide-react";

export default function HomePage() {
    const { auth, plans, stats, filters, flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: flash.success,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } else if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: flash.error,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
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
        router.get(
            route("home"),
            { search, status },
            { preserveState: true }
        );
    };

    const handleDelete = (plan) => {
        Swal.fire({
            title: "Anda yakin?",
            text: `Anda akan menghapus rencana "${plan.title}". Tindakan ini tidak dapat dibatalkan!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("plans.destroy", plan.id));
            }
        });
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
        labels: ["Tertunda", "Sedang Dikerjakan", "Selesai"],
        colors: ["#F59E0B", "#3B82F6", "#10B981"],
        legend: {
            position: "bottom",
        },
    };
    const chartSeries = [stats.pending, stats.in_progress, stats.completed];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            👋 Hai, {auth.user.name}!
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Selamat datang kembali, mari kita produktif hari ini.
                        </p>
                    </div>
                    <Link href={route("plans.create")}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0">
                            + Buat Rencana
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold text-lg mb-2">
                            Statistik
                        </h3>
                        <ApexCharts
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                            width="100%"
                        />
                    </div>
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow flex flex-col justify-center">
                        <h3 className="font-semibold text-lg mb-4">
                            Cari & Filter Rencana
                        </h3>
                        <form onSubmit={handleSearch} className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari berdasarkan judul atau konten..."
                                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Button type="submit">Cari</Button>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    type="button"
                                    variant={statusFilter === "" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusFilter("")}
                                >
                                    Semua ({stats.total})
                                </Button>
                                <Button
                                    type="button"
                                    variant={statusFilter === "pending" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusFilter("pending")}
                                >
                                    Tertunda ({stats.pending})
                                </Button>
                                <Button
                                    type="button"
                                    variant={statusFilter === "in_progress" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusFilter("in_progress")}
                                >
                                    Dikerjakan ({stats.in_progress})
                                </Button>
                                <Button
                                    type="button"
                                    variant={statusFilter === "completed" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusFilter("completed")}
                                >
                                    Selesai ({stats.completed})
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Daftar Rencanamu</h2>
                    </div>
                    <div className="space-y-4">
                        {plans.data && plans.data.length > 0 ? (
                            plans.data.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="border p-4 rounded-md hover:bg-gray-50 transition"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-bold text-lg">
                                                    {plan.title}
                                                </h4>
                                                {getStatusBadge(plan.status)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {plan.content}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Dibuat pada:{" "}
                                                {new Date(
                                                    plan.created_at
                                                ).toLocaleDateString("id-ID")}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={route("plans.show", plan.id)}
                                            >
                                                <Button variant="default" size="sm">
                                                    Detail
                                                </Button>
                                            </Link>
                                            <Link
                                                href={route("plans.edit", plan.id)}
                                            >
                                                <Button variant="outline" size="sm">
                                                    Ubah
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(plan)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-4">
                                    Belum ada rencana. Mulai buat rencana pertama Anda!
                                </p>
                                <Link href={route("plans.create")}>
                                    <Button>Buat Rencana Pertama</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    {plans.meta?.links && (
                        <Pagination links={plans.meta.links} className="mt-6" />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
