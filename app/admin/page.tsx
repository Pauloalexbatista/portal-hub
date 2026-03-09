"use client";

import React from "react";
import { ServerStats } from "@/components/ServerStats";

export default function AdminPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Monitorização VPS */}
            <ServerStats />

            <div className="border-t border-white/5 pt-12">
                <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl text-center">
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">
                        Sistema de Gestão de Projetos Desativado
                    </p>
                    <p className="text-zinc-600 text-[10px] mt-2 italic px-12 leading-relaxed">
                        Este portal está agora configurado exclusivamente para monitorização de infraestrutura.
                        Todas as rotas de projetos externos foram removidas para garantir a máxima segurança e performance da VPS.
                    </p>
                </div>
            </div>
        </div>
    );
}
