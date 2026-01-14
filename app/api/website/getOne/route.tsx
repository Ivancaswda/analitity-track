import { NextRequest, NextResponse } from "next/server"
import getServerUser from "@/lib/auth-server"
import { db } from "@/configs/db"
import { websitesTable } from "@/configs/schema"
import { and, eq } from "drizzle-orm"
import { getWebsiteAnalytics } from "@/lib/analytics/getWebsiteAnalytics"

export async function GET(req: NextRequest) {
    const user = await getServerUser()

    if (!user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    const websiteId = searchParams.get("websiteId")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!websiteId) {
        return NextResponse.json({ error: "websiteId required" }, { status: 400 })
    }

    const site = await db
        .select()
        .from(websitesTable)
        .where(
            and(
                eq(websitesTable.websiteId, websiteId),
                eq(websitesTable.userEmail, user.email)
            )
        )
        .limit(1)

    if (!site.length) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const analytics = await getWebsiteAnalytics(site[0], {
        from,
        to,
    })

    return NextResponse.json({ data: analytics })
}
