import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Index({ notes }) {
    const { flash } = usePage().props;

    return (
        <div className="container mx-auto p-4">
            <Head title="Daftar Catatan" />

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Daftar Catatan</h1>
                <Link
                    href={route("notes.create")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Tambah Catatan
                </Link>
            </div>

            {flash.message && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    {flash.message}
                </div>
            )}

            <div className="space-y-4">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className="p-4 border rounded-lg shadow-sm"
                    >
                        <h2 className="text-xl font-semibold">{note.title}</h2>
                        <p className="text-gray-600 mt-2">{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
