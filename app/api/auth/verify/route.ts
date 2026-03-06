import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/lib/config-helper";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Read config dynamically to bypass Next.js static production cache
        const config = getConfig();

        const mapping = config.mappings.find((m: any) => m.password === password);

        if (mapping) {
            const response = NextResponse.json({
                success: true,
                slug: mapping.slug
            });

            // Set session cookie
            response.cookies.set("project_session", "active", {
                path: "/",
                maxAge: 3600,
                httpOnly: false, // Accessible by client-side router
                sameSite: "lax",
            });

            return response;
        }

        return NextResponse.json({ success: false }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
