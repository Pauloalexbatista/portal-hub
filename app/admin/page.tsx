"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Globe, Lock, FolderOpen } from "lucide-react";

interface Mapping {
    password: string;
    projectPath: string;
    slug: string;
    entryFile?: string;
}

const FolderExplorer = ({ onSelect }: { onSelect: (path: string) => void }) => {
    const [path, setPath] = useState("");
    const [history, setHistory] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const browse = async (targetPath = "") => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/fs-explorer?path=${encodeURIComponent(targetPath)}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
                setPath(data.currentPath);
            }
        } catch (e) {
            console.error("Browse error", e);
        }
        setLoading(false);
    };

    useEffect(() => { browse(); }, []);

    return (
        <div className="bg-black/60 border border-white/5 rounded-lg overflow-hidden">
            <div className="p-3 bg-white/5 border-b border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-hidden">
                    <button
                        onClick={() => browse(history?.parentPath)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors text-zinc-400"
                        title="Subir Diretorário"
                    >
                        <FolderOpen className="w-3.5 h-3.5" />
                    </button>
                    <code className="text-[10px] text-zinc-500 truncate font-mono">{path}</code>
                </div>
                {history?.currentPath && (
                    <button
                        onClick={() => onSelect(history.currentPath)}
                        className="text-[9px] uppercase font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-all border border-emerald-500/20"
                    >
                        Selecionar Pasta
                    </button>
                )}
            </div>
            <div className="max-h-[200px] overflow-y-auto p-2 grid grid-cols-1 gap-1 custom-scrollbar">
                {loading ? (
                    <div className="py-8 flex justify-center"><div className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div></div>
                ) : (
                    history?.directories.map((dir: any) => (
                        <button
                            key={dir.path}
                            onClick={() => browse(dir.path)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-md text-left transition-all group"
                            title={`Navegar para ${dir.name}`}
                        >
                            <FolderOpen className="w-3.5 h-3.5 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">{dir.name}</span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default function AdminPage() {
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const [newMapping, setNewMapping] = useState<Mapping>({
        password: "",
        projectPath: "",
        slug: "",
        entryFile: "index.html"
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
            setNewMapping({ password: "", projectPath: "", slug: "", entryFile: "index.html" });
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
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Form de Adição */}
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl space-y-6 shadow-2xl">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400/80 mb-6 border-b border-white/5 pb-4">Conectar Novo Projeto</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Navegação de Pastas */}
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold italic flex items-center gap-2">
                            1. Navegador de Pastas VPS
                            <span className="text-[9px] not-italic bg-zinc-800 px-1.5 rounded border border-white/5">Auto-Discovery</span>
                        </label>
                        <FolderExplorer onSelect={(path) => {
                            const folderName = path.split(/[\\/]/).pop() || "";
                            setNewMapping({ ...newMapping, projectPath: path, slug: newMapping.slug || folderName.toLowerCase() });
                        }} />
                        <div className="text-[10px] text-zinc-600 bg-black/20 p-2 rounded italic">
                            Clica nas pastas para navegar. Clica em "Selecionar" quando encontrares o projeto.
                        </div>
                    </div>

                    {/* Configuração de Acesso */}
                    <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-zinc-500 font-bold italic">2. Endereço Público (Link)</label>
                                <input
                                    type="text"
                                    placeholder="ex: vinhos-premium"
                                    value={newMapping.slug}
                                    onChange={(e) => setNewMapping({ ...newMapping, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    className="w-full bg-black/40 border border-white/5 rounded-lg py-2 px-4 focus:ring-1 focus:ring-emerald-500/50 outline-none text-emerald-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-zinc-500 font-bold italic text-emerald-500/60">3. Arquivo de Entrada</label>
                                <input
                                    type="text"
                                    placeholder="index.html"
                                    value={newMapping.entryFile}
                                    onChange={(e) => setNewMapping({ ...newMapping, entryFile: e.target.value })}
                                    className="w-full bg-black/40 border border-emerald-500/20 rounded-lg py-2 px-4 focus:ring-1 focus:ring-emerald-500/50 outline-none text-emerald-200"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase text-zinc-500 font-bold italic">4. Password de Acesso</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                placeholder="ex: senha_secreta_2024"
                                value={newMapping.password}
                                onChange={(e) => setNewMapping({ ...newMapping, password: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-lg py-2 px-4 focus:ring-1 focus:ring-emerald-500/50 outline-none text-emerald-200 font-mono"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-4 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-8 py-3 rounded-xl transition-all w-full shadow-lg shadow-emerald-500/5 group"
                            title="Ativar o link do projeto selecionado"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="font-bold uppercase tracking-wider text-xs">Ativar Link Seguro</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Listagem */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400/80 mb-6 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Projetos em Produção
                </h2>

                {loading ? (
                    <div className="text-zinc-500 font-mono text-xs">Sincronizando com VPS...</div>
                ) : (
                    <div className="grid gap-4">
                        {mappings.map((m) => (
                            <div key={m.slug} className="group bg-zinc-900 border border-white/5 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-emerald-500/20 transition-all shadow-xl">
                                <div className="flex flex-col md:flex-row gap-8 items-center flex-1 max-w-[85%]">
                                    <div className="flex flex-col min-w-[200px]">
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1">URL Pública</span>
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3 h-3 text-emerald-500" />
                                            <code className="text-emerald-400 text-sm font-bold">testeweb.cloud/p/{m.slug}/</code>
                                        </div>
                                    </div>

                                    <div className="flex flex-col text-zinc-300 flex-1">
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1 italic">Localização absoluta (Disco)</span>
                                        <div className="flex items-center gap-2 font-mono text-[10px] leading-none text-zinc-500 truncate">
                                            <FolderOpen className="min-w-[12px] w-3 h-3" />
                                            {m.projectPath}
                                        </div>
                                    </div>

                                    <div className="flex flex-col text-zinc-300 min-w-[150px]">
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1 italic">Chave Digital</span>
                                        <div className="flex items-center gap-2 font-mono text-sm leading-none text-zinc-200">
                                            <Lock className="w-3 h-3 text-zinc-600" />
                                            {m.password}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(m.slug)}
                                    className="p-3 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                    title="Revogar Acesso"
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
