import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Show({ plan }) {
    const formatDateTime = (isoString) => {
        if (!isoString) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(isoString));
    };

    const createdAt = formatDateTime(plan.data.created_at);
    const completedAt = plan.data.completed_at
        ? formatDateTime(plan.data.completed_at)
        : null;

    const coverImage = plan.data.cover_image_url;

    const statusConfig = {
        pending: {
            label: "Tertunda",
            className: "bg-yellow-100 text-yellow-800 border-yellow-300",
            icon: Clock,
        },
        in_progress: {
            label: "Sedang dikerjakan",
            className: "bg-blue-100 text-blue-800 border-blue-300",
            icon: Loader,
        },
        completed: {
            label: "Selesai",
            className: "bg-green-100 text-green-800 border-green-300",
            icon: CheckCircle,
        },
    };

    const getStatusBadge = (status) => {
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                    config.className
                )}
            >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title={plan.data.title} />

            <div className="bg-muted/30">
                <div className="container mx-auto px-4 py-10 space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href={route("plans.index") ?? route("home")}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>

                    <section className="rounded-3xl overflow-hidden relative shadow-lg">
                        <div className="relative h-64 w-full">
                            <img
                                src={
                                    coverImage ||
                                    "/images/cover-placeholder.jpg"
                                }
                                alt={`Sampul ${plan.data.title}`}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white space-y-2">
                                <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                                    Rencana
                                </p>
                                <h1
                                    className={cn(
                                        "text-3xl font-semibold leading-tight",
                                        plan.data.status === "completed" &&
                                            "text-white/80 line-through"
                                    )}
                                >
                                    {plan.data.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                                    {plan.data.status &&
                                        getStatusBadge(plan.data.status)}
                                    <span>Dibuat pada {createdAt}</span>
                                    {completedAt && (
                                        <span>Selesai pada {completedAt}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Detail Rencana</CardTitle>
                            <CardDescription>
                                Lihat catatan lengkap yang sudah kamu simpan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 text-sm text-muted-foreground">
                                <p>Ditambahkan pada {createdAt}</p>
                                {completedAt && (
                                    <p>Selesai pada {completedAt}</p>
                                )}
                            </div>
                            <div
                                className="prose prose-sm max-w-none text-muted-foreground"
                                dangerouslySetInnerHTML={{
                                    __html: plan.data.content || "",
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
