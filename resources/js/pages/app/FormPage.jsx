import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";

export default function FormPage({ plan }) {
    const isEditing = !!plan;

    const { data, setData, post, put, processing, errors } = useForm({
        title: plan?.title || "",
        content: plan?.content || "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        const options = {
            preserveScroll: true,
        };
        if (isEditing) {
            put(route("plans.update", plan.id), options);
        } else {
            post(route("plans.store"), options);
        }
    }

    const handleTrixChange = (html) => {
        setData("content", html);
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <Head title={isEditing ? "Edit Rencana" : "Tambah Rencana"} />

            <div className="bg-white p-8 rounded-lg shadow-md mt-10">
                <h1 className="text-2xl font-bold mb-6">
                    {isEditing ? "Edit Rencana" : "Tambah Rencana Baru"}
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Judul
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.title && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.title}
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="content"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Konten
                        </label>
                        {/* Trix Editor untuk input konten */}
                        <TrixEditor
                            className="trix-content"
                            onChange={handleTrixChange}
                            value={data.content}
                        />
                        {errors.content && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.content}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={route("home")}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
