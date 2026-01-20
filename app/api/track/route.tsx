// /api/track/route.tsx
import {NextRequest, NextResponse} from "next/server";
import {db} from "@/configs/db";
import {pageViewTable, websitesTable} from "@/configs/schema";
import getServerUser from "@/lib/auth-server";
import {UAParser} from 'ua-parser-js'
import {eq, and, isNull} from "drizzle-orm";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"

}
export async function OPTIONS(req: NextRequest) {

        return new NextResponse(null, {
            status: 200,
            headers: CORS_HEADERS
        })

}


export async function POST(req: NextRequest) {
    try {
        console.log("TRACK BODY:", req.body)
        const user = await getServerUser()
        const body = await req.json()
        const parser = new UAParser(req.headers.get('user-agent') || "");
        const deviceInfo = parser.getDevice();
        const osInfo = parser.getOS()
        const browserInfo = parser.getBrowser();
        const forwardedFor = req.headers.get("x-forwarded-for")
        let realIp =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            ""



        const geo = req?.geo

        const country = geo?.country ?? null
        const region = geo?.region ?? null
        const city = geo?.city ?? null

        const deviceType = deviceInfo.type || "desktop"
        const osName = osInfo.name || "Unknown"
        const browserName = browserInfo.name || "Unknown"


        const entryTime =
            typeof body.entryTime === "number"
                ? body.entryTime
                : Date.now()

        if (body.type === "ping") {
            return NextResponse.json({ success: true } , { headers: CORS_HEADERS })
        }

        let result
        if (body?.type === 'entry') {
           result = await db.insert(pageViewTable).values({
                visitorId: body.visitorId,
                websiteId: body.websiteId,
                domain: body.domain,
                url: body.url,
                type: body.type,
                referrer: body.referrer,
                entryTime: entryTime,
                exitTime: body.exitTime,
                totalActiveTime: body.totalActiveTime,
                urlParams: body.urlParams,
                utm_source: body.utm_source,
                utm_medium: body.utm_medium,
                utm_campaign: body.utm_campaign,
                os: osName,
                refParams: body.refParams,
               device: deviceType,
               browser: browserName,
               country: country ?? null,
               region: region ?? null,
               city: city ?? null,
               countryCode: geo?.country ??  null,
               ipAddress: realIp,
            }).returning()

            console.log('inserted Result', result)
        } else {
           result = await db.update(pageViewTable).set({
                exitTime: body.exitTime,
                totalActiveTime: body.totalActiveTime
            }).where(
               and(
                   eq(pageViewTable.visitorId, body.visitorId),
                   eq(pageViewTable.websiteId, body.websiteId),
                   isNull(pageViewTable.exitTime)
               )
           )
            console.log('updated Result', result)
        }
  return NextResponse.json({success:true, message: 'Data received successfully', data:result},
            {headers: CORS_HEADERS})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status: 500, headers: CORS_HEADERS})
    }
}