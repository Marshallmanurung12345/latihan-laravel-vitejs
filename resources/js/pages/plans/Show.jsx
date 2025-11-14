import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function ShowPage({ plan }) {
    return (
        <AppLayout>
            <Head title={`Detail Rencana: ${plan.title}`} />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Link href={route("home")}>
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali ke Dashboard
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            {plan.cover_image_url && (
                                <img
                                    src={plan.cover_image_url}
                                    alt={`Sampul untuk ${plan.title}`}
                                    className="w-full h-64 object-cover rounded-t-lg mb-4"
                                />
                            )}
                            <CardTitle className="text-3xl font-bold">
                                {plan.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground pt-2">
                                Dibuat pada:{" "}
                                {new Date(plan.created_at).toLocaleDateString(
                                    "id-ID",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none whitespace-pre-wrap">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: plan.content,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
