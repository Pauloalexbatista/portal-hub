import { NextRequest, NextResponse } from "next/server";
import si from "systeminformation";
import fs from "fs";
import path from "path";

const CRONS_PATH = path.join(process.cwd(), "data", "crons.json");

export async function GET() {
    try {
        // 1. Get System Stats
        const [cpu, mem, disk, os, net] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.osInfo(),
            si.networkStats()
        ]);

        // 2. Get Top Processes (CPU intensive)
        const procs = await si.processes();
        const topProcs = procs.list
            .sort((a, b) => b.cpu - a.cpu)
            .slice(0, 5)
            .map(p => ({
                name: p.name,
                cpu: p.cpu,
                mem: p.mem,
                user: p.user
            }));

        // 3. Get Cron Heartbeats
        let crons = [];
        if (fs.existsSync(CRONS_PATH)) {
            crons = JSON.parse(fs.readFileSync(CRONS_PATH, "utf8"));
        }

        return NextResponse.json({
            system: {
                hostname: os.hostname,
                platform: os.platform,
                distro: os.distro,
                kernel: os.kernel,
                uptime: si.time().uptime
            },
            cpu: {
                currentLoad: cpu.currentLoad,
                cores: cpu.cpus.length,
                avgLoad: cpu.avgLoad
            },
            memory: {
                total: mem.total,
                free: mem.free,
                used: mem.used,
                percent: (mem.used / mem.total) * 100
            },
            disk: disk.map(d => ({
                fs: d.fs,
                size: d.size,
                used: d.used,
                available: d.available,
                use: d.use,
                mount: d.mount
            })).find(d => d.mount === "/") || disk[0],
            network: {
                tx: net[0]?.tx_sec || 0,
                rx: net[0]?.rx_sec || 0,
                interface: net[0]?.iface
            },
            processes: topProcs,
            crons: crons
        });
    } catch (error: any) {
        console.error("Error fetching system stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
