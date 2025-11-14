import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";

export default function Form({ plan }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: plan?.title || "",
        content: plan?.content || "",
    });

    const [isTrixReady, setIsTrixReady] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (plan) {
            put(route("plans.update", plan.id));
        } else {
            post(route("plans.store"));
        }
    }

    const handleTrixChange = (html, text) => {
        setData("content", html);
    };

    const handleTrixInitialize = () => {
        setIsTrixReady(true);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <Head title={plan ? "Edit Rencana" : "Tambah Rencana"} />
            <h1 className="text-2xl font-bold mb-6">
                {plan ? "Edit Rencana" : "Tambah Rencana"}
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
                        className="block text-sm font-medium text-gray-700"
                    >
                        Konten
                    </label>
                    <TrixEditor
                        className="trix-content"
                        onChange={handleTrixChange}
                        onEditorReady={handleTrixInitialize}
                        value={data.content}
                    />
                    {errors.content && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.content}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end">
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
    );
}
