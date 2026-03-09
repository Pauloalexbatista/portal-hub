import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CRONS_PATH = path.join(DATA_DIR, "crons.json");
const AUTH_TOKEN = process.env.CRON_TOKEN || "magico-secret-123";

export async function POST(request: NextRequest) {
    try {
        const { jobName, status, token } = await request.json();

        if (token !== AUTH_TOKEN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        let crons = [];
        if (fs.existsSync(CRONS_PATH)) {
            crons = JSON.parse(fs.readFileSync(CRONS_PATH, "utf8"));
        }

        // Update or add job
        const jobIndex = crons.findIndex((j: any) => j.name === jobName);
        const jobData = {
            name: jobName,
            status: status || "success",
            lastRun: new Date().toISOString(),
        };

        if (jobIndex >= 0) {
            crons[jobIndex] = jobData;
        } else {
            crons.push(jobData);
        }

        fs.writeFileSync(CRONS_PATH, JSON.stringify(crons, null, 4), "utf8");

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to log heartbeat" }, { status: 500 });
    }
}
