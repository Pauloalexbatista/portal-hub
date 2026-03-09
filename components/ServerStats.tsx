"use client";

import React, { useEffect, useState } from "react";
import {
    Cpu,
    MemoryStick as Memory,
    HardDrive,
    Activity,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Network
} from "lucide-react";
import { motion } from "framer-motion";

export const ServerStats = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/server-stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error("Error fetching stats", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) {
        return <div className="animate-pulse text-emerald-500 font-mono text-xs">A ligar ao servidor...</div>;
    }

    const formatBytes = (bytes: number) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatUptime = (seconds: number) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${d}d ${h}h ${m}m`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 font-mono">
            {/* CPU */}
            <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <Cpu className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Processador</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold text-white">{stats?.cpu.currentLoad.toFixed(1)}%</span>
                        <span className="text-[10px] text-emerald-400/60">{stats?.cpu.cores} Cores</span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats?.cpu.currentLoad}%` }}
                            className={`h-full ${stats?.cpu.currentLoad > 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        />
                    </div>
                </div>
            </div>

            {/* RAM */}
            <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <Memory className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Memória RAM</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold text-white">{stats?.memory.percent.toFixed(1)}%</span>
                        <span className="text-[10px] text-zinc-500">{formatBytes(stats?.memory.used)} / {formatBytes(stats?.memory.total)}</span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats?.memory.percent}%` }}
                            className={`h-full ${stats?.memory.percent > 85 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        />
                    </div>
                </div>
            </div>

            {/* DISK */}
            <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <HardDrive className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Disco (SSD)</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold text-white">{stats?.disk.use.toFixed(1)}%</span>
                        <span className="text-[10px] text-zinc-500">{formatBytes(stats?.disk.used)} / {formatBytes(stats?.disk.size)}</span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats?.disk.use}%` }}
                            className={`h-full ${stats?.disk.use > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        />
                    </div>
                </div>
            </div>

            {/* NETWORK */}
            <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <Network className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Tráfego VPS</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center pt-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase text-zinc-500">Download</span>
                        <span className="text-sm font-bold text-emerald-400">{formatBytes(stats?.network.rx)}/s</span>
                    </div>
                    <div className="flex flex-col border-l border-white/5">
                        <span className="text-[9px] uppercase text-zinc-500">Upload</span>
                        <span className="text-sm font-bold text-zinc-400">{formatBytes(stats?.network.tx)}/s</span>
                    </div>
                </div>
            </div>

            {/* CRON JOBS STATUS */}
            <div className="md:col-span-2 lg:col-span-3 bg-zinc-950 border border-emerald-500/20 p-6 rounded-2xl shadow-inner-emerald">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500/80">Monitorização de Crons (Números Mágicos)</h3>
                </div>

                <div className="space-y-4">
                    {stats?.crons.length === 0 ? (
                        <div className="text-zinc-600 italic text-[10px]">Nenhum heartbeat recebido ainda. Adiciona o webhook ao teu script.</div>
                    ) : (
                        stats?.crons.map((cron: any) => {
                            const lastRun = new Date(cron.lastRun);
                            const isLate = (Date.now() - lastRun.getTime()) > (24 * 3600000);
                            return (
                                <div key={cron.name} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${isLate ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                                            {isLate ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-zinc-200">{cron.name}</div>
                                            <div className="text-[10px] text-zinc-500 italic">Última execução: {lastRun.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-bold uppercase tracking-tighter px-3 py-1 rounded-full ${isLate ? 'text-red-400 border border-red-500/30' : 'text-emerald-400 border border-emerald-500/30'}`}>
                                        {isLate ? "Atrasado" : "Concluído"}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* SYSTEM INFO */}
            <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">INFO VPS</span>
                </div>
                <div className="space-y-3 pt-2">
                    <div>
                        <div className="text-[9px] text-zinc-600 uppercase font-bold leading-none">Uptime</div>
                        <div className="text-xs font-mono text-zinc-300">{formatUptime(stats?.system.uptime)}</div>
                    </div>
                    <div>
                        <div className="text-[9px] text-zinc-600 uppercase font-bold leading-none">Kernel</div>
                        <div className="text-xs font-mono text-zinc-300 truncate">{stats?.system.kernel}</div>
                    </div>
                    <div>
                        <div className="text-[9px] text-zinc-600 uppercase font-bold leading-none">Status</div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-emerald-400/80 font-bold">ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
