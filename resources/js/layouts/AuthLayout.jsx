import React from "react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
            {/* Main Content */}
            <main className="w-full max-w-md">{children}</main>
        </div>
    );
}
