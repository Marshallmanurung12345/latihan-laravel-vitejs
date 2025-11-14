import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Home({ plans }) {
    const { flash } = usePage().props;

    return (
        <div className="container mx-auto p-4">
            <Head title="Halaman Utama" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Rencana Anda</h1>
                <Link
                    href={route("plans.create")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
                >
                    + Buat Rencana
                </Link>
            </div>

            {flash.message && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-200 rounded-lg">
                    {flash.message}
                </div>
            )}

            <div className="space-y-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">
                            {plan.title}
                        </h2>
                        <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                            {plan.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
