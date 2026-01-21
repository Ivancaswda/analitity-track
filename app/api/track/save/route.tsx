// /api/track/save/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/configs/db"
import { pageViewTable } from "@/configs/schema"
import { and, eq, isNull } from "drizzle-orm"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (body.type === "entry") {
            await db.insert(pageViewTable).values({
                visitorId: body.visitorId,
                websiteId: body.websiteId,
                domain: body.domain,
                url: body.url,
                referrer: body.referrer,
                entryTime: body.entryTime,

                utm_source: body.utm_source,
                utm_medium: body.utm_medium,
                utm_campaign: body.utm_campaign,
                refParams: body.refParams,

                device: body.device,
                os: body.os,
                browser: body.browser,

                country: body.country,
                countryCode: body.countryCode,
                region: body.region,
                city: body.city,

                ipAddress: body.ipAddress,
            })
        }

        if (body.type === "exit") {
            await db
                .update(pageViewTable)
                .set({
                    exitTime: body.exitTime,
                    totalActiveTime: body.totalActiveTime,
                })
                .where(
                    and(
                        eq(pageViewTable.visitorId, body.visitorId),
                        eq(pageViewTable.websiteId, body.websiteId),
                        isNull(pageViewTable.exitTime)
                    )
                )
        }

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error("SAVE ERROR", e)
        return NextResponse.json({ error: true }, { status: 500 })
    }
}
