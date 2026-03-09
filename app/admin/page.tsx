"use client";

import React from "react";
import { ServerStats } from "@/components/ServerStats";

export default function AdminPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Monitorização VPS */}
            <ServerStats />
        </div>
    );
}
