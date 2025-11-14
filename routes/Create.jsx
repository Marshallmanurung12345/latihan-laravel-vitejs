import React from "react";
import { Head, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
    });

    function submit(e) {
        e.preventDefault();
        post(route("notes.store"));
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Head title="Tambah Catatan Baru" />
            <h1 className="text-2xl font-bold mb-4">Tambah Catatan Baru</h1>

            <form onSubmit={submit} className="space-y-4">
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                    {errors.content && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.content}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    Simpan
                </button>
            </form>
        </div>
    );
}
