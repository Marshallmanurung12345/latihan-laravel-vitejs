import React, { useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Head, Link, router, usePage } from "@inertiajs/react";
import ApexCharts from "react-apexcharts";
import Pagination from "@/components/Pagination"; // Asumsi Anda punya komponen ini

export default function HomePage() {
    const { auth, plans, stats, filters } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("home"), { search }, { preserveState: true });
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
                            Buat Rencana
                        </Button>
                    </Link>
                </div>

                {/* Statistik */}
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
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari berdasarkan judul atau konten..."
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </form>
                    </div>
                </div>

                {/* Daftar Rencana */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-6">
                        Daftar Rencanamu
                    </h2>
                    <div className="space-y-4">
                        {plans.data.map((plan) => (
                            <div
                                key={plan.id}
                                className="border p-4 rounded-md flex justify-between items-center"
                            >
                                <div>
                                    <h4 className="font-bold text-lg">
                                        {plan.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Dibuat pada: {plan.created_at}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link href={route("plans.edit", plan.id)}>
                                        <Button variant="outline">Ubah</Button>
                                    </Link>
                                    <Link
                                        href={route("plans.destroy", plan.id)}
                                        method="delete"
                                        as="button"
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Hapus
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination links={plans.meta.links} className="mt-6" />
                </div>
            </div>
        </AppLayout>
    );
}
