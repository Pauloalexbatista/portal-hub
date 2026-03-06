import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function serveProjectFile(projectPath: string, filePath: string[], entryFile: string = "index.html") {
    // If projectPath is absolute (starts with / or C:\), use it directly. 
    // Otherwise, fallback to local projects folder for legacy/relative support.
    const isAbsolute = path.isAbsolute(projectPath);
    const baseDir = isAbsolute ? projectPath : path.join(process.cwd(), "projects", projectPath);
    const fullPath = path.join(baseDir, ...filePath);

    // Security check: only restrict if it's NOT absolute (legacy mode)
    // For absolute paths, we trust the Admin Panel's explicit mapping.
    if (!isAbsolute && !fullPath.startsWith(path.resolve(path.join(process.cwd(), "projects")))) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const fileStats = fs.statSync(fullPath);
        if (!fileStats.isFile()) {
            // If it's a directory, try to serve entryFile
            const indexPath = path.join(fullPath, entryFile);
            if (fs.existsSync(indexPath)) {
                return serveFile(indexPath);
            }
            return new NextResponse("Not Found", { status: 404 });
        }
        return serveFile(fullPath);
    } catch (e) {
        return new NextResponse("Not Found", { status: 404 });
    }
}

function serveFile(filePath: string) {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes: { [key: string]: string } = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".json": "application/json",
    };

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": mimeTypes[ext] || "application/octet-stream",
        },
    });
}
