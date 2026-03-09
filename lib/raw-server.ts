import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

/**
 * Serves a project file directly from the filesystem without any modification.
 * This is intended for use within an IFrame where relative paths work natively.
 */
export async function serveRawProjectFile(projectPath: string, filePath: string[], entryFile: string = "index.html") {
    const isAbsolute = path.isAbsolute(projectPath);
    const baseDir = isAbsolute ? projectPath : path.join(process.cwd(), "projects", projectPath);

    let targetPath = path.join(baseDir, ...filePath);

    // 1. Navigation logic for directories and empty paths
    if (filePath.length === 0) {
        targetPath = path.join(baseDir, entryFile);
    } else if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
        targetPath = path.join(targetPath, entryFile);
    } else if (!fs.existsSync(targetPath)) {
        // Try auto-resolving .html extension
        const htmlPath = targetPath + ".html";
        if (fs.existsSync(htmlPath)) {
            targetPath = htmlPath;
        }
    }

    // 2. Safety Check: Existence and File Type (Avoid exceptions)
    if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
        return new NextResponse("Not Found", { status: 404 });
    }

    // 3. Serve File with correct MIME type
    const fileBuffer = fs.readFileSync(targetPath);
    const ext = path.extname(targetPath).toLowerCase();

    const mimeTypes: { [key: string]: string } = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".json": "application/json",
        ".ico": "image/x-icon",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
    };

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": mimeTypes[ext] || "application/octet-stream",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
