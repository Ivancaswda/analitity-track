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

async function getGeoByIP(ip: string) {
    if (!ip || ip === "127.0.0.1" || ip === "::1") {
        return {
            country: null,
            countryCode: null,
            region: null,
            city: null,
        }
    }

    try {
        const res = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city`
        )

        const data = await res.json()

        if (data.status !== "success") {
            return {
                country: null,
                countryCode: null,
                region: null,
                city: null,
            }
        }

        return {
            country: data.country,
            countryCode: data.countryCode,
            region: data.regionName,
            city: data.city,
        }
    } catch {
        return {
            country: null,
            countryCode: null,
            region: null,
            city: null,
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // --- IP ---
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            ""

        console.log("IP:", ip)
        console.log("body-type===", body.type)

        // ping не сохраняем
        if (body.type === "ping") {
            return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
        }

        // --- UA ---
        const parser = new UAParser(req.headers.get("user-agent") || "")
        const device = parser.getDevice().type || "desktop"
        const os = parser.getOS().name || "Unknown"
        const browser = parser.getBrowser().name || "Unknown"

        // --- GEO BY IP ---
        const geo = await getGeoByIP(ip)

        const origin = req.nextUrl.origin

        await fetch(`${origin}/api/track/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...body,

                type: body.type,

                device,
                os,
                browser,

                ipAddress: ip,

                country: geo.country,
                countryCode: geo.countryCode,
                region: geo.region,
                city: geo.city,
            }),
        })

        return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
    } catch (e) {
        console.error("TRACK ERROR", e)
        return NextResponse.json({ error: true }, { status: 500 })
    }
}
