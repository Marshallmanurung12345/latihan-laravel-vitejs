import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
    });
 
    function submit(e) {
        e.preventDefault();
        post(route("plans.store"));
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Head title="Tambah Catatan Baru" />
            <h1 className="text-2xl font-bold mb-4">Tambah Catatan Baru</h1>

            <form onSubmit={submit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Judul
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Contoh: Belajar Laravel & React"
                    />
                    {errors.title && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.title}
                        </div>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Isi Catatan
                    </label>
                    <textarea
                        id="content"
                        value={data.content}
                        onChange={(e) => setData("content", e.target.value)}
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Tuliskan detail rencana Anda di sini..."
                    ></textarea>
                    {errors.content && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.content}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end space-x-4">
                    <Link href={route('home')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Simpan Rencana
                    </button>
                </div>
            </form>
        </div>
    );
}
