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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

const STATUS_OPTIONS = [
    { value: "pending", label: "Tertunda" },
    { value: "in_progress", label: "Sedang dikerjakan" },
    { value: "completed", label: "Selesai" },
];

const normalizeStatus = (value) => {
    if (value === "todo") return "pending";
    return value || "pending";
};

export default function FormPage({ plan }) {
    const isEditing = !!plan;
    const fileInputRef = useRef();
    const [previewUrl, setPreviewUrl] = useState(plan?.cover_image_url || null);

    const initialStatus = normalizeStatus(plan?.status);

    const { data, setData, post, processing, errors } = useForm({
        title: plan?.title || "",
        content: plan?.content || "",
        status: initialStatus,
        cover_image: null,
        _method: isEditing ? "PUT" : "POST",
    });

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            title: plan?.title || "",
            content: plan?.content || "",
            status: normalizeStatus(plan?.status),
            cover_image: null,
            _method: isEditing ? "PUT" : "POST",
        }));
        setPreviewUrl(plan?.cover_image_url || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [isEditing, plan?.id]);

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
        const options = { preserveScroll: true };
        if (isEditing) {
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

            <div className="bg-muted/30">
                <div className="container mx-auto px-4 py-10 space-y-8">
                    <section className="rounded-3xl bg-card border shadow-sm p-8 text-center space-y-4">
                        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                            {isEditing ? "Perbarui Rencana" : "Rencana Baru"}
                        </p>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold">
                                {isEditing
                                    ? plan?.title || "Edit Rencana"
                                    : "Susun rencana terbaikmu"}
                            </h1>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Tambahkan detail rencana lengkap dengan catatan
                                dan foto sampul untuk menjaga fokus dan
                                dokumentasi pekerjaanmu.
                            </p>
                        </div>
                    </section>

                    <Card className="max-w-4xl mx-auto shadow-lg">
                        <CardHeader>
                            <CardTitle>
                                {isEditing
                                    ? "Edit Rencana"
                                    : "Tambah Rencana Baru"}
                            </CardTitle>
                            <CardDescription>
                                Lengkapi informasi di bawah ini, lalu simpan
                                ketika semuanya sudah siap.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <FieldGroup className="space-y-6">
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
                                            Deskripsi
                                        </FieldLabel>
                                        <textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) =>
                                                setData(
                                                    "content",
                                                    e.target.value
                                                )
                                            }
                                            rows={10}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
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
                                        <FieldLabel htmlFor="status">
                                            Status
                                        </FieldLabel>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                            aria-invalid={!!errors.status}
                                        >
                                            {STATUS_OPTIONS.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.status && (
                                            <FieldDescription className="text-destructive">
                                                {errors.status}
                                            </FieldDescription>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="cover_image">
                                            Foto Sampul (opsional)
                                        </FieldLabel>
                                        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-4">
                                            {previewUrl ? (
                                                <div className="space-y-3">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Pratinjau sampul"
                                                        className="w-full h-56 object-cover rounded-xl"
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            Gambar berhasil
                                                            dipilih
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className="text-destructive"
                                                            onClick={clearImage}
                                                        >
                                                            Hapus gambar
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground text-center">
                                                    Unggah gambar untuk
                                                    mempercantik detail rencana.
                                                </p>
                                            )}
                                            <div className="mt-4">
                                                <Input
                                                    type="file"
                                                    id="cover_image"
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                    aria-invalid={
                                                        !!errors.cover_image
                                                    }
                                                />
                                                {errors.cover_image && (
                                                    <FieldDescription className="text-destructive">
                                                        {errors.cover_image}
                                                    </FieldDescription>
                                                )}
                                            </div>
                                        </div>
                                    </Field>
                                </FieldGroup>

                                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
                                    <Link
                                        href={
                                            route("plans.index") ??
                                            route("home")
                                        }
                                    >
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
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
