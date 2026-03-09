import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/lib/config-helper";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Read config dynamically
        const config = getConfig();

        if (password === config.adminPassword) {
            const response = NextResponse.json({
                success: true
            });

            // Set session cookie for admin
            response.cookies.set("admin_session", "active", {
                path: "/",
                maxAge: 3600,
                httpOnly: false,
                sameSite: "lax",
            });

            return response;
        }

        return NextResponse.json({ success: false }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
