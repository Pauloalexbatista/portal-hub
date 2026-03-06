import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "lib", "config.json");

function getConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

function saveConfig(config: any) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), "utf8");
}

export async function GET() {
    try {
        const config = getConfig();
        return NextResponse.json(config.mappings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const newMapping = await request.json(); // { password, projectPath, slug }
        const config = getConfig();

        // Remove existing mapping with same slug if any
        config.mappings = config.mappings.filter((m: any) => m.slug !== newMapping.slug);
        config.mappings.push(newMapping);

        saveConfig(config);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save mapping" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { slug } = await request.json();
        const config = getConfig();

        config.mappings = config.mappings.filter((m: any) => m.slug !== slug);

        saveConfig(config);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete mapping" }, { status: 500 });
    }
}
