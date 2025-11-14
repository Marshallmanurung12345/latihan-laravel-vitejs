import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Swal from "sweetalert2";

// Komponen untuk Pagination Links
const Pagination = ({ links }) => {
    return (
        <div className="flex flex-wrap -mb-1">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <div
                            key={key}
                            className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link
                        key={key}
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${
                            link.active ? "bg-white" : ""
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
                <form onSubmit={handleSearch} className="flex items-center">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari rencana..."
                        className="border rounded-l px-4 py-2 w-80"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r"
                    >
                        Cari
                    </button>
                </form>
                {/* Tombol Tambah Data */}
                <Link
                    href={route("plans.create")}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + Tambah Rencana
                </Link>
            </div>

            {/* Tabel Data */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="text-left font-bold">
                            <th className="px-6 pt-6 pb-4">Judul</th>
                            <th className="px-6 pt-6 pb-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.data.map((plan) => (
                            <tr
                                key={plan.id}
                                className="hover:bg-gray-100 focus-within:bg-gray-100"
                            >
                                <td className="border-t px-6 py-4">
                                    {plan.title}
                                </td>
                                <td className="border-t px-6 py-4">
                                    <Link
                                        href={route("plans.edit", plan.id)}
                                        className="text-indigo-600 hover:underline mr-4"
                                    >
                                        Ubah
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(plan)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {plans.data.length === 0 && (
                            <tr>
                                <td className="border-t px-6 py-4" colSpan="2">
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
    );
}
