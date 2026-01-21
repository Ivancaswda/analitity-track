// /api/track/route.ts
import { NextRequest, NextResponse } from "next/server"
import { UAParser } from "ua-parser-js"

export const runtime = "edge"

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // --- UA ---
        const parser = new UAParser(req.headers.get("user-agent") || "")
        const device = parser.getDevice().type || "desktop"
        const os = parser.getOS().name || "Unknown"
        const browser = parser.getBrowser().name || "Unknown"

        // --- GEO (EDGE ONLY) ---
        const geo = req.geo || {}

        // --- IP ---
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            ""
        console.log('body-type===', body.type)
        // ping не сохраняем
        if (body.type === "ping") {
            return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
        }


        const origin = req.nextUrl.origin
        // прокидываем ВСЁ дальше
        await fetch(`${origin}/api/track/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...body,

                device,
                os,
                browser,

                ipAddress: ip,

                country: geo.country || null,
                countryCode: geo.country || null,
                region: geo.region || null,
                city: geo.city || null,
            }),
        })

        return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
    } catch (e) {
        console.error("EDGE TRACK ERROR", e)
        return NextResponse.json({ error: true }, { status: 500 })
    }
}
