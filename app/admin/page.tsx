"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Globe, Lock, FolderOpen } from "lucide-react";

interface Mapping {
    password: string;
    projectPath: string;
    slug: string;
}

export default function AdminPage() {
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const [newMapping, setNewMapping] = useState<Mapping>({
        password: "",
        projectPath: "",
        slug: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMappings();
    }, []);

    const fetchMappings = async () => {
        const res = await fetch("/api/admin/projects");
        if (res.ok) {
            const data = await res.json();
            setMappings(data);
        }
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!newMapping.slug || !newMapping.password || !newMapping.projectPath) return;

        const res = await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMapping),
        });

        if (res.ok) {
            setNewMapping({ password: "", projectPath: "", slug: "" });
            fetchMappings();
        }
    };

    const handleDelete = async (slug: string) => {
        const res = await fetch("/api/admin/projects", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
        });

        if (res.ok) {
            fetchMappings();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Form de Adição */}
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400/80 mb-6">Novo Atalho de Projeto</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1 italic">Slug (URL)</label>
                        <input
                            type="text"
                            placeholder="ex: vinhos"
                            value={newMapping.slug}
                            onChange={(e) => setNewMapping({ ...newMapping, slug: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 rounded-lg py-2 px-4 focus:ring-1 focus:ring-emerald-500/50 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1 italic">Diretório na VPS</label>
                        <input
                            type="text"
                            placeholder="ex: 3d-wine"
                            value={newMapping.projectPath}
                            onChange={(e) => setNewMapping({ ...newMapping, projectPath: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 rounded-lg py-2 px-4 focus:ring-1 focus:ring-emerald-500/50 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1 italic">Password para Cliente</label>
                        <input
                            type="text"
                            placeholder="ex: cliente_vinhos_2024"
                            value={newMapping.password}
                            onChange={(e) => setNewMapping({ ...newMapping, password: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 rounded-lg py-2 px-4 focus:ring-1 focus:ring-emerald-500/50 outline-none"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="mt-4 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-6 py-2 rounded-lg transition-all w-full md:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar Projeto
                </button>
            </div>

            {/* Listagem */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400/80 mb-6 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Projetos Ativos
                </h2>

                {loading ? (
                    <div className="text-zinc-500 font-mono text-xs">A carregar registos...</div>
                ) : (
                    <div className="grid gap-4">
                        {mappings.map((m) => (
                            <div key={m.slug} className="group bg-zinc-900 border border-white/5 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-emerald-500/20 transition-all">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1">URL Pública</span>
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3 h-3 text-emerald-500" />
                                            <code className="text-emerald-400">testeweb.cloud/p/{m.slug}/</code>
                                        </div>
                                    </div>

                                    <div className="flex flex-col text-zinc-300">
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1 italic">Pasta (VPS)</span>
                                        <div className="flex items-center gap-2 font-mono text-sm leading-none pt-0.5">
                                            <FolderOpen className="w-3 h-3" />
                                            {m.projectPath}
                                        </div>
                                    </div>

                                    <div className="flex flex-col text-zinc-300">
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1 italic">Senha de Acesso</span>
                                        <div className="flex items-center gap-2 font-mono text-sm leading-none pt-0.5">
                                            <Lock className="w-3 h-3 text-zinc-600" />
                                            {m.password}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(m.slug)}
                                    className="p-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Remover Projeto"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
