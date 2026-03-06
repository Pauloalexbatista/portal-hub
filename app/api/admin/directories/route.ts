import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const projectsPath = path.join(process.cwd(), "projects");

        if (!fs.existsSync(projectsPath)) {
            return NextResponse.json([]);
        }

        const entries = fs.readdirSync(projectsPath, { withFileTypes: true });
        const directories = entries
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        return NextResponse.json(directories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to list directories" }, { status: 500 });
    }
}
