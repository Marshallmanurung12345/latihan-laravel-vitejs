import { useEffect } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const VARIANTS = {
    success: {
        icon: CheckCircle2,
        bg: "bg-emerald-50",
        border: "border-emerald-400",
        text: "text-emerald-900",
    },
    error: {
        icon: AlertTriangle,
        bg: "bg-rose-50",
        border: "border-rose-400",
        text: "text-rose-900",
    },
};

export default function FlashAlert({
    text,
    variant = "success",
    duration = 2500,
    onFinish,
}) {
    useEffect(() => {
        if (!text) return;
        const timer = setTimeout(() => onFinish?.(), duration);
        return () => clearTimeout(timer);
    }, [text, duration, onFinish]);

    if (!text) return null;

    const styles = VARIANTS[variant] ?? VARIANTS.success;
    const Icon = styles.icon;

    return (
        <div className="fixed top-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-xl">
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.bg} ${styles.border}`}
            >
                <Icon className={`h-5 w-5 ${styles.text}`} />
            </div>
            <div>
                <p className={`text-sm font-semibold ${styles.text}`}>
                    {variant === "success" ? "Berhasil" : "Terjadi Kesalahan"}
                </p>
                <p className="text-sm text-slate-600">{text}</p>
            </div>
        </div>
    );
}
