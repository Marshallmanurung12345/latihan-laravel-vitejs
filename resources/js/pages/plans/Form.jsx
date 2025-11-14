import { Head, Link, router, useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css"; // Pastikan CSS Trix diimpor

export default function Form({ plan }) {
    const { data, setData, errors, processing, post, progress } = useForm({
        title: plan?.title || "",
        content: plan?.content || "",
        cover: null,
        _method: plan ? "PUT" : "POST", // Untuk spoofing method di Laravel
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = plan
            ? route("plans.update", plan.id)
            : route("plans.store");
        // Gunakan metode 'post' dari useForm, yang secara otomatis menangani file upload.
        post(url);
    };

    const handleTrixChange = (html) => {
        setData("content", html);
    };

    // Menangani upload file di Trix Editor
    useEffect(() => {
        const handleAttachmentAdd = (event) => {
            const attachment = event.attachment;
            if (attachment.file) {
                const formData = new FormData();
                formData.append("attachment", attachment.file);

                // Kirim file ke server
                fetch(route("plans.attachments.store"), {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-CSRF-TOKEN": document.head.querySelector('meta[name="csrf-token"]').content,
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    // Beritahu Trix URL gambar yang sudah diupload
                    attachment.setAttributes({
                        url: data.url,
                        href: data.url,
                    });
                })
                .catch((error) => console.error("Upload error:", error));
            }
        };

        document.addEventListener("trix-attachment-add", handleAttachmentAdd);

        // Cleanup listener saat komponen di-unmount
        return () => {
            document.removeEventListener("trix-attachment-add", handleAttachmentAdd);
        };
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Head title={plan ? "Ubah Rencana" : "Tambah Rencana"} />
            <div className="mb-6">
                <Link
                    href={route("plans.index")}
                    className="text-blue-600 hover:underline"
                >
                    &larr; Kembali ke Dashboard
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Kolom Form Utama */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6">
                        {plan ? "Ubah Rencana" : "Tambah Rencana Baru"}
                    </h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Judul */}
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
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.title && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.title}
                                </div>
                            )}
                        </div>

                        {/* Konten (Trix Editor) */}
                        <div className="mb-6">
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Konten
                            </label>
                            <TrixEditor
                                className="trix-content"
                                value={data.content}
                                onChange={handleTrixChange}
                            />
                            {errors.content && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.content}
                                </div>
                            )}
                        </div>

                        {/* Input File untuk Cover */}
                        <div className="mb-6">
                            <label
                                htmlFor="cover"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Cover Gambar (Opsional)
                            </label>
                            <input
                                type="file"
                                id="cover"
                                onChange={(e) =>
                                    setData("cover", e.target.files[0])
                                }
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.cover && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.cover}
                                </div>
                            )}
                        </div>

                        {/* Progress Bar untuk Upload */}
                        {progress && (
                            <div className="w-full bg-gray-200 rounded-full mb-4">
                                <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress.percentage}%` }}> {progress.percentage}%</div>
                            </div>
                        )}

                        {/* Tombol Aksi */}
                        <div className="flex items-center justify-end">
                            <Link
                                href={route("plans.index")}
                                as="button"
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-4"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-blue-300"
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : plan
                                    ? "Perbarui"
                                    : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Kolom Cover (hanya tampil saat edit) */}
                {plan && (
                    <div className="bg-white p-6 rounded-lg shadow-md self-start">
                        <h2 className="text-xl font-semibold mb-4">
                            Cover Saat Ini
                        </h2>
                        {plan.cover ? (
                            <img
                                src={plan.cover}
                                alt="Cover"
                                className="w-full h-auto rounded mb-4"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
                                <span className="text-gray-500">
                                    Tidak ada cover
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
