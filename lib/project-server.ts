import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const PROJECTS_PATH = path.join(process.cwd(), "projects");

export async function serveProjectFile(projectPath: string, filePath: string[]) {
    const fullPath = path.join(PROJECTS_PATH, projectPath, ...filePath);

    // Security check: ensure path is within projects directory
    if (!fullPath.startsWith(path.resolve(PROJECTS_PATH))) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const fileStats = fs.statSync(fullPath);
        if (!fileStats.isFile()) {
            // If it's a directory, try to serve index.html
            const indexPath = path.join(fullPath, "index.html");
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
