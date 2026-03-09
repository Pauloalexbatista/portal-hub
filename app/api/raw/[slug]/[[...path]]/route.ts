import { NextRequest, NextResponse } from "next/server";
import { serveRawProjectFile } from "@/lib/raw-server";
import { getConfig } from "@/lib/config-helper";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; path?: string[] }> }
) {
    try {
        const { slug, path: pathSegmentsArr } = await params;

        const config = getConfig();
        const mapping = config.mappings.find((m: any) => m.slug === slug);

        if (!mapping) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const mappedPath = (mapping as any).projectPath || (mapping as any).path;
        const pathSegments = pathSegmentsArr || [];

        return serveRawProjectFile(
            mappedPath,
            pathSegments,
            (mapping as any).entryFile || "index.html"
        );
    } catch (error: any) {
        console.error("Error in raw API route:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
