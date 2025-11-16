import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import AuthLayout from "@/layouts/AuthLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

const featureHighlights = [
    {
        title: "Rencana adaptif",
        description: "Update status dan cek statistik dalam satu klik.",
        icon: CheckCircle2,
    },
    {
        title: "Keamanan terjaga",
        description: "Seluruh data terenkripsi dengan standar enterprise.",
        icon: ShieldCheck,
    },
    {
        title: "UI fokus",
        description: "Tampilan minimalis membantu fokus pada prioritas.",
        icon: Sparkles,
    },
];

export default function LoginPage() {
    const { success } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route("auth.login.post"));
    };

    return (
        <AuthLayout>
            <div className="grid gap-10 rounded-[32px] border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
                <section className="space-y-6 text-white">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100">
                        <Sparkles className="h-4 w-4 text-amber-200" />
                        Portal Produktivitas
                    </span>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                            Masuk dan lanjutkan rencana terbaikmu
                        </h1>
                        <p className="max-w-xl text-base text-indigo-100/90 sm:text-lg">
                            Sinkronkan catatan, pantau progres, dan tuntaskan
                            target tanpa meninggalkan satu dashboard pun. Semua
                            prioritasmu tersaji rapi dan siap dieksekusi.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {featureHighlights.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="rounded-2xl border border-white/20 bg-white/5 p-4"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <p className="mt-3 text-base font-semibold">
                                        {feature.title}
                                    </p>
                                    <p className="text-sm text-indigo-100/80">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-indigo-100/80">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                            Sistem siap pakai 24/7
                        </div>
                        <span className="h-4 w-px bg-white/30" />
                        <div>120+ rencana aktif setiap minggunya</div>
                    </div>
                </section>

                <Card className="border-none bg-white/95 text-slate-900 shadow-2xl">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl">
                            Masuk ke akun Anda
                        </CardTitle>
                        <CardDescription>
                            Terhubung kembali dengan semua rencana dan insight
                            terbaru.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success && (
                            <div className="mb-6">
                                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <AlertTitle>Sukses!</AlertTitle>
                                    <AlertDescription>
                                        {success}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FieldGroup className="space-y-5">
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="contoh@email.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <div className="text-sm text-red-600">
                                            {errors.email}
                                        </div>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password">
                                        Kata sandi
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Masukkan kata sandi"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    {errors.password && (
                                        <div className="text-sm text-red-600">
                                            {errors.password}
                                        </div>
                                    )}
                                </Field>
                            </FieldGroup>

                            <Button
                                type="submit"
                                className="w-full gap-2"
                                disabled={processing}
                            >
                                {processing ? "Memproses..." : "Masuk"}
                                <ArrowRight className="h-4 w-4" />
                            </Button>

                            <FieldDescription className="text-center text-sm text-muted-foreground">
                                Belum punya akun?{" "}
                                <Link
                                    href={route("auth.register")}
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Daftar di sini
                                </Link>
                            </FieldDescription>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
