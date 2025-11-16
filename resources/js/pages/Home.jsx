import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
    PencilIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import FlashAlert from "@/components/FlashAlert";

const heroHighlights = [
    {
        title: "Statistik realtime",
        description:
            "Setiap perubahan langsung memperbarui grafik dan ringkasan.",
    },
    {
        title: "Aksi instan",
        description: "Ubah, tandai selesai, atau hapus dalam satu klik.",
    },
    {
        title: "Fokus terkurasi",
        description:
            "Filter rencana sesuai prioritas dan temukan yang penting.",
    },
];

const Pagination = ({ links }) => {
    return (
        <div className="flex flex-wrap -mb-1">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <span
                            key={key}
                            className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-white/40 border border-white/20 rounded"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link
                        key={key}
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded-md transition-colors duration-200 ${
                            link.active
                                ? "bg-white text-slate-900"
                                : "bg-white/5 text-white/80 hover:bg-white/10"
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
    const [alert, setAlert] = useState(null);

    // Sederhanakan logika flash message
    useEffect(() => {
        if (flash?.success) {
            setAlert({ message: flash.success, variant: "success" });
        } else if (flash?.error) {
            setAlert({ message: flash.error, variant: "error" });
        }
    }, [flash]);

    const handleSearch = useCallback(
        (e) => {
            e.preventDefault();
            router.get(route("home"), { search }, { preserveState: true });
        },
        [search]
    );

    const handleDelete = useCallback((plan) => {
        const confirmed = window.confirm(
            `Anda akan menghapus rencana "${plan.title}". Tindakan ini tidak dapat dibatalkan!`
        );

        if (confirmed) {
            router.delete(route("plans.destroy", plan.id));
        }
    }, []);

    const chartSeries = useMemo(
        () => [
            {
                name: "Jumlah Rencana",
                data: [
                    stats.total ?? plans.data.length,
                    stats.done ?? 0,
                    stats.pending ?? 0,
                ],
            },
        ],
        [stats, plans.data.length]
    );

    const chartOptions = useMemo(
        () => ({
            chart: { id: "basic-bar", foreColor: "#e2e8f0" },
            xaxis: { categories: ["Total", "Selesai", "Tertunda"] },
            grid: { borderColor: "rgba(255,255,255,0.1)" },
            colors: ["#38bdf8"],
        }),
        []
    );

    const summaryCards = [
        {
            label: "Total Rencana",
            value: stats.total ?? plans.data.length,
            caption: "Semua rencana aktif",
        },
        {
            label: "Selesai",
            value: stats.done ?? 0,
            caption: "Tuntas tanpa tertinggal",
        },
        {
            label: "Tertunda",
            value: stats.pending ?? 0,
            caption: "Menunggu aksi berikutnya",
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950">
            <Head title="Dashboard Rencana" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.25),transparent_60%)]" />
            <div className="absolute inset-y-0 -right-24 hidden lg:block h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 blur-3xl" />
            <div className="absolute inset-y-0 -left-32 hidden lg:block h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-500/30 to-purple-500/20 blur-3xl" />

            <FlashAlert
                text={alert?.message}
                variant={alert?.variant}
                onFinish={() => setAlert(null)}
            />

            <div className="relative z-10 px-4 py-10 text-white">
                <section className="mx-auto max-w-5xl space-y-6">
                    <div className="space-y-3 text-center md:text-left">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-200">
                            Dashboard MarshallTodos
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight">
                            Rencanakan hari ini, raih target besok
                        </h1>
                        <p className="text-base text-slate-200/80">
                            Pantau statistik, kelola catatan, dan tuntaskan
                            pekerjaan dengan gaya baru yang seragam di seluruh
                            aplikasi.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {summaryCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-xl"
                            >
                                <p className="text-xs uppercase tracking-wide text-slate-200">
                                    {card.label}
                                </p>
                                <p className="mt-2 text-3xl font-semibold">
                                    {card.value}
                                </p>
                                <p className="text-sm text-slate-200/80">
                                    {card.caption}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl">
                        <h2 className="text-lg font-semibold">
                            Statistik 7 hari terakhir
                        </h2>
                        <p className="text-sm text-slate-200/80">
                            Perbandingan total rencana, selesai, dan tertunda.
                        </p>
                        <ReactApexChart
                            options={chartOptions}
                            series={chartSeries}
                            type="bar"
                            height={320}
                        />
                    </div>
                    <div className="rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl space-y-5">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <label className="text-sm font-semibold text-slate-100">
                                Cari rencana
                            </label>
                            <div className="relative">
                                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cth: presentasi produk"
                                    className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm placeholder-white/50 focus:border-white focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
                            >
                                Cari sekarang
                            </button>
                        </form>
                        <div className="space-y-3 text-sm text-slate-200/80">
                            {heroHighlights.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                >
                                    <p className="text-white font-medium">
                                        {item.title}
                                    </p>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto mt-10 max-w-6xl space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Daftar Rencana
                            </h2>
                            <p className="text-sm text-slate-200/80">
                                Kelola judul, status, serta tindakan hapus atau
                                ubah.
                            </p>
                        </div>
                        <Link
                            href={route("plans.create")}
                            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" /> Tambah Rencana
                        </Link>
                    </div>

                    <div className="rounded-3xl border border-white/15 bg-white text-slate-900 shadow-2xl">
                        <div className="overflow-x-auto rounded-3xl">
                            <table className="w-full whitespace-nowrap text-left">
                                <thead className="bg-slate-100/80 text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    <tr>
                                        <th className="px-6 py-3">Judul</th>
                                        <th className="px-6 py-3 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {plans.data.map((plan) => (
                                        <tr
                                            key={plan.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {plan.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end space-x-4 text-xs font-semibold">
                                                    <Link
                                                        href={route(
                                                            "plans.edit",
                                                            plan.id
                                                        )}
                                                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <PencilIcon className="mr-1 h-4 w-4" />{" "}
                                                        Ubah
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(plan)
                                                        }
                                                        className="inline-flex items-center text-rose-600 hover:text-rose-800"
                                                    >
                                                        <TrashIcon className="mr-1 h-4 w-4" />{" "}
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {plans.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="2"
                                                className="px-6 py-8 text-center text-slate-500"
                                            >
                                                Tidak ada data rencana
                                                ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-slate-100 px-6 py-4">
                            <Pagination links={plans.links} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
