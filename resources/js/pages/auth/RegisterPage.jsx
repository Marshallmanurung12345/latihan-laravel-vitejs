import React from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useForm } from "@inertiajs/react";

export default function RegisterPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post("/auth/register/post", {
            onSuccess: () => {
                reset("name", "email", "password");
            },
            onError: () => {
                reset("password");
            },
        });
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Buat akun baru
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Daftar dan mulai kelola rencana serta catatan Anda.
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Daftar untuk akun baru</CardTitle>
                        <CardDescription>
                            Isi formulir di bawah ini untuk membuat akun baru
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Nama Lengkap
                                    </FieldLabel>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Masukkan nama lengkap"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.name && (
                                        <div className="text-sm text-red-600">
                                            {errors.name}
                                        </div>
                                    )}
                                </Field>
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
                                        required
                                    />
                                    {errors.email && (
                                        <div className="text-sm text-red-600">
                                            {errors.email}
                                        </div>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">
                                        Kata Sandi
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Masukkan kata sandi"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.password && (
                                        <div className="text-sm text-red-600">
                                            {errors.password}
                                        </div>
                                    )}
                                </Field>
                                <Field>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? "Memproses..." : "Daftar"}
                                    </Button>
                                    <FieldDescription className="text-center">
                                        Sudah punya akun?{" "}
                                        <Link
                                            href="/auth/login"
                                            className="text-primary hover:underline"
                                        >
                                            Masuk di sini
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
