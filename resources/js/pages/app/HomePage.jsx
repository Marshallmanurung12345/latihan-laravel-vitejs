import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Head, Link, router, usePage } from "@inertiajs/react";
import ApexCharts from "react-apexcharts";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";

export default function HomePage() {
    const { auth, plans, stats, filters, flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");

    // Tampilkan notifikasi flash message
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
        router.get(route("home"), { search }, { preserveState: true });
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

    // Konfigurasi untuk ApexCharts
    const chartOptions = {
        chart: {
            type: "donut",
        },
        labels: ["Total", "Selesai", "Tertunda"],
        colors: ["#3B82F6", "#10B981", "#F59E0B"],
        legend: {
            position: "bottom",
        },
    };
    const chartSeries = [stats.total, stats.done, stats.pending];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            👋 Hai, {auth.user.name}!
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Selamat datang kembali, mari kita produktif hari
                            ini.
                        </p>
                    </div>
                    <Link href={route("plans.create")}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0">
                            + Buat Rencana
                        </Button>
                    </Link>
                </div>

                {/* Statistik & Search */}
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
                            Cari Rencana
                        </h3>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari berdasarkan judul atau konten..."
                                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button type="submit">Cari</Button>
                        </form>
                    </div>
                </div>

                {/* Daftar Rencana */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-6">
                        Daftar Rencanamu
                    </h2>
                    <div className="space-y-4">
                        {plans.data && plans.data.length > 0 ? (
                            plans.data.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="border p-4 rounded-md flex justify-between items-center hover:bg-gray-50 transition"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">
                                            {plan.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {plan.description ||
                                                "Tidak ada deskripsi"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Dibuat pada:{" "}
                                            {new Date(
                                                plan.created_at
                                            ).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
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
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-4">
                                    Belum ada rencana. Mulai buat rencana
                                    pertama Anda!
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
