import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/lib/config-helper";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; path?: string[] }> }
) {
    try {
        const { slug, path: pathSegments } = await params;

        const config = getConfig();
        const mapping = config.mappings.find((m: any) => m.slug === slug);

        if (!mapping) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const isRoot = !pathSegments || pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === "");

        if (isRoot) {
            const rawSrc = `/api/raw/${slug}/index.html`;

            const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Visualizador: ${slug}</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background: #000;
        }
        iframe {
            border: none;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <iframe src="${rawSrc}" allowfullscreen></iframe>
</body>
</html>
        `.trim();

            return new NextResponse(html, {
                headers: { "Content-Type": "text/html" }
            });
        }

        const targetPathArr = pathSegments || [];
        const targetPath = targetPathArr.join('/');
        return NextResponse.rewrite(new URL(`/api/raw/${slug}/${targetPath}`, request.url));
    } catch (error: any) {
        console.error("Error in project route:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
