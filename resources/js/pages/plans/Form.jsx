import React, { useState, useEffect } from "react";
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

                                <div className="flex items-center justify-end space-x-4 pt-4">
                                    <Link href={route("home")}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                        >
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
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