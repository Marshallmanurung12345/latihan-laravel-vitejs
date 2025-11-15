import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
    PencilIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

// Komponen untuk Pagination Links
const Pagination = ({ links }) => {
    return (
        <div className="flex flex-wrap -mb-1">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <span
                            key={key}
                            className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link
                        key={key}
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded-md transition-colors duration-200 hover:bg-indigo-500 hover:text-white focus:border-indigo-500 focus:text-indigo-500 ${
                            link.active
                                ? "bg-indigo-500 text-white"
                                : "bg-white"
                        }`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
};

export default function Home({ plans, filters, stats }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");

    // Efek untuk menampilkan notifikasi SweetAlert2
    useEffect(() => {
        if (flash.success) {
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
        } else if (flash.error) {
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

    // Fungsi untuk menangani pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("home"), { search }, { preserveState: true });
    };

    // Fungsi untuk menghapus data dengan konfirmasi
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
        chart: { id: "basic-bar" },
        xaxis: { categories: ["Total", "Selesai", "Tertunda"] },
    };
    const chartSeries = [
        {
            name: "Jumlah Rencana",
            data: [stats.total, stats.done, stats.pending],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-4 md:p-8">
                <Head title="Dashboard Rencana" />
                <h1 className="text-3xl font-bold mb-6">Dashboard Rencana</h1>

                {/* Statistik ApexCharts */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Statistik</h2>
                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="bar"
                        height={350}
                    />
                </div>

                <div className="flex justify-between items-center mb-6">
                    {/* Form Pencarian */}
                    <form
                        onSubmit={handleSearch}
                        className="relative w-full max-w-md"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari rencana..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </form>
                    {/* Tombol Tambah Data */}
                    <Link
                        href={route("plans.create")}
                        className="inline-flex items-center justify-center ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 whitespace-nowrap"
                    >
                        <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                        Tambah Rencana
                    </Link>
                </div>

                {/* Tabel Data */}
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead className="bg-gray-50">
                            <tr className="text-left font-semibold text-sm text-gray-600 uppercase tracking-wider">
                                <th className="px-6 py-3">Judul</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {plans.data.map((plan) => (
                                <tr
                                    key={plan.id}
                                    className="hover:bg-gray-50 focus-within:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="border-t px-6 py-4">
                                        {plan.title}
                                    </td>
                                    <td className="border-t px-6 py-4">
                                        <div className="flex items-center justify-end space-x-4">
                                            <Link
                                                href={route(
                                                    "plans.edit",
                                                    plan.id
                                                )}
                                                className="inline-flex items-center text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                            >
                                                <PencilIcon className="w-4 h-4 mr-1" />
                                                Ubah
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(plan)
                                                }
                                                className="inline-flex items-center text-red-600 hover:text-red-900 transition-colors duration-200"
                                            >
                                                <TrashIcon className="w-4 h-4 mr-1" />
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {plans.data.length === 0 && (
                                <tr>
                                    <td
                                        className="border-t px-6 py-4"
                                        colSpan="2"
                                    >
                                        Tidak ada data rencana ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6">
                    <Pagination links={plans.links} />
                </div>
            </div>
        </div>
    );
}
