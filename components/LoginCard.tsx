"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ChevronRight, AlertCircle } from "lucide-react";

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
                const data = await res.json();
                // Redirect to the actual project route
                window.location.href = `/p/${data.slug}/`;
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={loading ? { scale: 1.1, opacity: 0, filter: "blur(10px)" } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative z-10 w-full max-w-md p-8 bg-zinc-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl"
        >
            <form onSubmit={handleLogin} className="flex flex-col items-center gap-6">
                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <ShieldCheck className={`w-12 h-12 text-emerald-400 ${loading ? 'animate-pulse' : ''}`} />
                </div>

                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-white/90">
                        Project Gateway
                    </h1>
                    <p className="text-sm text-emerald-400/60 mt-1 font-mono uppercase tracking-widest">
                        testeweb.cloud
                    </p>
                </div>

                <div className="w-full space-y-4">
                    <div className="relative group">
                        <input
                            type="password"
                            placeholder="Digite a senha de acesso..."
                            disabled={loading}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(false);
                            }}
                            className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/5'} rounded-lg py-4 px-12 text-center text-emerald-300 placeholder:text-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono tracking-widest disabled:opacity-50`}
                        />
                        <div className="absolute inset-y-0 left-4 flex items-center">
                            <span className={`w-2 h-2 rounded-full border ${error ? 'border-red-500' : 'border-emerald-500/50'} ${loading ? 'animate-ping' : 'group-focus-within:animate-ping'}`} />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-400 text-xs justify-center font-mono"
                        >
                            <AlertCircle className="w-4 h-4" />
                            Senha incorreta ou projeto inacessível.
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        disabled={loading}
                        className="w-full bg-emerald-500/80 hover:bg-emerald-500 text-black font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                    >
                        {loading ? "Autenticando..." : "Entrar no Sistema"}
                        {!loading && <ChevronRight className="w-5 h-5" />}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};
