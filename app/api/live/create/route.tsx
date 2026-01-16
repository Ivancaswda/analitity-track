import {NextRequest, NextResponse} from "next/server";
import {UAParser} from "ua-parser-js";
import {db} from "@/configs/db";
import {liveUserTable} from "@/configs/schema";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"

}
export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get('origin') || "*";
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"

        }
    })
}
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const {visitorId, websiteId,last_seen, url } = body;

        //parse device info from user
        const parser = new UAParser(req.headers.get('user-agent'))
        const deviceType = parser.getDevice()?.type || 'Desktop';
        const osInfo = parser.getOS()?.name || '';
        const browserInfo = parser.getBrowser()?.name || '';

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]
         || req.headers.get('x-real-ip') || "71.71.22.54"

        const geoRes = await fetch(`http://ip-api.com/json/71.71.22.54`)
        const geoInfo = await geoRes.json()
        const now = new Date()

        await db
            .insert(liveUserTable)
            .values({
                visitorId,
                websiteId,
                last_seen: now,
                city: geoInfo.city || '',
                country: geoInfo.country || '',
                countryCode: geoInfo.countryCode || '',
                lat: geoInfo.lat?.toString() || '',
                lng: geoInfo.lon?.toString() || '',
                device: deviceType,
                os: osInfo,
                browser: browserInfo,
            })
            .onConflictDoUpdate({
                target: liveUserTable.visitorId,
                set: {
                    last_seen: now,
                    city: geoInfo.city || '',
                    country: geoInfo.country || '',
                    countryCode: geoInfo.countryCode || '',
                    lat: geoInfo.lat?.toString() || '',
                    lng: geoInfo.lon?.toString() || '',
                    device: deviceType,
                    os: osInfo,
                    browser: browserInfo,
                },
            })
        return NextResponse.json({status: "ok"}, {headers: CORS_HEADERS})




    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {headers: CORS_HEADERS})
    }
}

