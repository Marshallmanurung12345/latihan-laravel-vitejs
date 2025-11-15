import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Show({ plan }) {
    // Format tanggal ke format yang mudah dibaca (e.g., "17 Agustus 2024")
    const formattedDate = new Date(plan.data.created_at).toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

    return (
        <AppLayout>
            <Head title={plan.data.title} />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Link href={route("plans.index")}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            {plan.data.cover_image_url && (
                                <img
                                    src={plan.data.cover_image_url}
                                    alt={`Sampul untuk ${plan.data.title}`}
                                    className="w-full h-64 object-cover rounded-t-lg mb-4"
                                />
                            )}
                            <CardTitle className="text-3xl font-bold">
                                {plan.data.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Dibuat pada: {formattedDate}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {/* Tampilkan konten sebagai HTML jika mengandung format, atau sebagai teks biasa */}
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: plan.data.content,
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
