"use client";

import { motion } from "framer-motion";

export default function DemoPage() {
    return (
        <motion.main
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-10"
        >
            <div className="max-w-4xl w-full space-y-8 text-center">
                <h1 className="text-4xl font-light tracking-tighter text-emerald-400">
                    PROJETO ALPHA <span className="text-white/20">|</span> v1.0.4
                </h1>

                <div className="aspect-video w-full bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
                    <p className="text-zinc-500 font-mono">Simulação do Projeto do Cliente Carregado Aqui</p>
                </div>

                <div className="flex justify-center gap-4">
                    <button className="px-6 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm hover:bg-emerald-500/10 transition-colors">
                        Ver Logs de Evolução
                    </button>
                    <button className="px-6 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors">
                        Enviar Feedback
                    </button>
                </div>
            </div>
        </motion.main>
    );
}
