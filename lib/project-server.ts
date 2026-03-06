import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function serveProjectFile(projectPath: string, filePath: string[], entryFile: string = "index.html", slug: string = "") {
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
                return serveFile(indexPath, slug);
            }
            return new NextResponse("Not Found", { status: 404 });
        }
        return serveFile(fullPath, slug);
    } catch (e) {
        return new NextResponse("Not Found", { status: 404 });
    }
}

function serveFile(filePath: string, slug: string = "") {
    let fileBuffer = fs.readFileSync(filePath);
    let content: string | Buffer = fileBuffer;
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

    // Fix for static assets path in HTML
    if (ext === ".html" && slug) {
        let html = fileBuffer.toString("utf-8");

        // 1. Inject Base Tag (cleanest)
        const baseTag = `<base href="/p/${slug}/">`;
        if (html.includes("<head>")) {
            html = html.replace("<head>", `<head>${baseTag}`);
        } else {
            html = html.replace("<html>", `<html><head>${baseTag}</head>`);
        }

        // 2. Fallback: Rewrite absolute Next.js paths just in case (sometimes scripts ignore base tag)
        // src="/_next/" -> src="_next/"
        // href="/_next/" -> href="_next/"
        html = html.replace(/src="\//g, 'src="');
        html = html.replace(/href="\//g, 'href="');

        content = html;
    }

    return new NextResponse(content, {
        headers: {
            "Content-Type": mimeTypes[ext] || "application/octet-stream",
        },
    });
}
