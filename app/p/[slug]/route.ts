import { serveProjectFile } from "@/lib/project-server";
import { NextRequest } from "next/server";
import { getConfig } from "@/lib/config-helper";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;

    // Read config dynamically to bypass Next.js static component caching
    const config = getConfig();

    // Find project mapping
    const mapping = config.mappings.find((m: any) => m.slug === slug);
    if (!mapping) {
        return new Response("Project Not Configured", { status: 404 });
    }

    // Get path from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').slice(3); // Remove /p/[slug]

    const mappedPath = (mapping as any).projectPath || (mapping as any).path || "";
    return serveProjectFile(mappedPath, pathSegments, (mapping as any).entryFile || "index.html");
}
