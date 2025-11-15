import React, { useState, useEffect, useRef } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FormPage({ plan }) {
    const isEditing = !!plan;
    const fileInputRef = useRef();
    const [previewUrl, setPreviewUrl] = useState(plan?.cover_image_url || null);

    const { data, setData, post, put, processing, errors } = useForm({
        title: plan?.title || "",
        content: plan?.content || "",
        cover_image: null,
        _method: isEditing ? "PUT" : "POST",
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("cover_image", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setData("cover_image", null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    function handleSubmit(e) {
        e.preventDefault();
        const options = {
            preserveScroll: true,
        };
        if (isEditing) {
            // Inertia's 'put' method doesn't support multipart/form-data well.
            // We use 'post' with a spoofed '_method' for file uploads on updates.
            post(route("plans.update", plan.id), options);
        } else {
            post(route("plans.store"), options);
        }
    }
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <AppLayout>
            <Head title={isEditing ? "Edit Rencana" : "Tambah Rencana"} />

            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {isEditing ? "Edit Rencana" : "Tambah Rencana Baru"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="title">
                                        Judul
                                    </FieldLabel>
                                    <Input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="Masukkan judul rencana..."
                                        aria-invalid={!!errors.title}
                                    />
                                    {errors.title && (
                                        <FieldDescription className="text-destructive">
                                            {errors.title}
                                        </FieldDescription>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="content">
                                        Konten
                                    </FieldLabel>
                                    <textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) =>
                                            setData("content", e.target.value)
                                        }
                                        rows={10}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Tulis detail rencana Anda di sini..."
                                        aria-invalid={!!errors.content}
                                    />
                                    {errors.content && (
                                        <FieldDescription className="text-destructive">
                                            {errors.content}
                                        </FieldDescription>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="cover_image">
                                        Foto Sampul (Opsional)
                                    </FieldLabel>
                                    {previewUrl && (
                                        <div className="mt-2 mb-4">
                                            <img
                                                src={previewUrl}
                                                alt="Pratinjau"
                                                className="w-full h-48 object-cover rounded-md"
                                            />
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="text-destructive px-0"
                                                onClick={clearImage}
                                            >
                                                Hapus Gambar
                                            </Button>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        id="cover_image"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        aria-invalid={!!errors.cover_image}
                                    />
                                    {errors.cover_image && (
                                        <FieldDescription className="text-destructive">
                                            {errors.cover_image}
                                        </FieldDescription>
                                    )}
                                </Field>

                                <div className="flex items-center justify-end space-x-4 pt-4">
                                    <Link href={route("plans.index")}>
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? "Menyimpan..."
                                            : isEditing
                                            ? "Perbarui"
                                            : "Simpan"}
                                    </Button>
                                </div>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
