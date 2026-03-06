import { serveProjectFile } from "@/lib/project-server";
import { NextRequest } from "next/server";
import config from "@/lib/config.json";

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string; path: string[] } }
) {
    const { slug } = await params;

    // Find project mapping
    const mapping = config.mappings.find((m) => m.slug === slug);
    if (!mapping) {
        return new Response("Project Not Configured", { status: 404 });
    }

    // Get path from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').slice(3); // Remove /p/[slug]

    return serveProjectFile(mapping.projectPath, pathSegments);
}
