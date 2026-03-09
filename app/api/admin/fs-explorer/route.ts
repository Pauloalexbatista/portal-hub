import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // --- SMART ROOTS LOGIC ---
        const isWin = os.platform() === 'win32';
        const defaultRoot = isWin
            ? "C:\\Users\\paulo\\.gemini\\antigravity\\playground\\core-omega"
            : "/home/root/staging_projects";

        let requestedPath = searchParams.get("path") || defaultRoot;

        // Normalize for cross-platform
        const targetDir = path.resolve(requestedPath);

        if (!fs.existsSync(targetDir)) {
            return NextResponse.json({ error: "Path does not exist" }, { status: 404 });
        }

        const entries = fs.readdirSync(targetDir, { withFileTypes: true });

        const directories = entries
            .filter(dirent => {
                // Ignore hidden folders and system files
                try {
                    return dirent.isDirectory() && !dirent.name.startsWith('.');
                } catch {
                    return false;
                }
            })
            .map(dirent => ({
                name: dirent.name,
                path: path.join(targetDir, dirent.name)
            }));

        return NextResponse.json({
            currentPath: targetDir,
            parentPath: path.dirname(targetDir),
            directories: directories.sort((a, b) => a.name.localeCompare(b.name))
        });
    } catch (error) {
        console.error("FS Explorer Error:", error);
        return NextResponse.json({ error: "Forbidden or disk error" }, { status: 403 });
    }
}
