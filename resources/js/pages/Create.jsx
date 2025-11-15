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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="container mx-auto max-w-2xl">
                <Head title="Tambah Catatan Baru" />

                <form
                    onSubmit={submit}
                    className="bg-white p-8 rounded-lg shadow-md"
                >
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        Tambah Catatan Baru
                    </h1>
                    <div className="space-y-6">
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
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow duration-200"
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
                                onChange={(e) =>
                                    setData("content", e.target.value)
                                }
                                rows="4"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow duration-200"
                                placeholder="Tuliskan detail rencana Anda di sini..."
                            ></textarea>
                            {errors.content && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.content}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 mt-8 pt-5 border-t border-gray-200">
                        <Link
                            href={route("home")}
                            className="px-4 py-2 border border-gray-300 text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            {processing ? "Menyimpan..." : "Simpan Rencana"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
