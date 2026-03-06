import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config.json";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Check against ENV or JSON config
        const adminSecret = process.env.ADMIN_PASSWORD || config.adminPassword;

        if (password === adminSecret) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
