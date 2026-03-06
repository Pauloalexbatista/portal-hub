"use client";

import React, { useState, useEffect } from "react";
import { MatrixBackground } from "@/components/MatrixBackground";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem("admin_auth");
        if (auth === "true") setIsAuthenticated(true);
    }, []);

    const handleAdminLogin = async () => {
        // Enviar para API para validar master password
        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            sessionStorage.setItem("admin_auth", "true");
            setIsAuthenticated(true);
        } else {
            setError(true);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
                <MatrixBackground />
                <div className="relative z-10 w-full max-w-sm p-8 bg-zinc-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl text-center">
                    <h1 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Painel de Controlo</h1>
                    <div className="space-y-4">
                        <input
                            type="password"
                            placeholder="ADMIN Master Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-center text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                        />
                        {error && <p className="text-red-400 text-xs font-mono">Acesso Negado</p>}
                        <button
                            onClick={handleAdminLogin}
                            className="w-full bg-emerald-500/80 hover:bg-emerald-500 text-black font-semibold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        >
                            Entrar
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen w-full bg-zinc-950 text-white selection:bg-emerald-500/30">
            <div className="max-w-6xl mx-auto p-8 pt-20">
                <div className="mb-12 flex justify-between items-center border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                            Gestão de Projetos
                        </h1>
                        <p className="text-emerald-500/60 font-mono text-sm mt-1">Admin Dashboard / testeweb.cloud</p>
                    </div>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem("admin_auth");
                            setIsAuthenticated(false);
                        }}
                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                    >
                        Terminar Sessão
                    </button>
                </div>
                {children}
            </div>
        </main>
    );
}
