"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export const LoginCard = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!password) return;
        setLoading(true);
        setError(false);

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                // Redirect to admin dashboard
                window.location.href = "/admin";
            } else {
                setLoading(false);
                setError(true);
            }
        } catch (err) {
            setLoading(false);
            setError(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={loading ? { scale: 1.05, opacity: 0, filter: "blur(10px)" } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[440px] p-10 bg-zinc-900/90 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl"
        >
            <form onSubmit={handleLogin} className="flex flex-col items-center gap-8">
                <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white/90">
                    Painel de Controlo
                </h1>

                <div className="w-full space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="ADMIN Master Password"
                            disabled={loading}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(false);
                            }}
                            className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-5 px-6 text-center text-emerald-400 placeholder:text-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono tracking-widest text-sm`}
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-[10px] font-mono uppercase tracking-widest text-center animate-pulse">
                            Acesso Negado. Tenta novamente.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-5 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
                    >
                        {loading ? "A processar..." : "Entrar"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};
