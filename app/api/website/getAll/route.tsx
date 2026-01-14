import {NextRequest, NextResponse} from "next/server";
import getServerUser from "@/lib/auth-server";
import {db} from "@/configs/db";
import {pageViewTable, websitesTable} from "@/configs/schema";
import {and, desc, eq, gte} from "drizzle-orm";
import {getWebsiteAnalytics} from "@/lib/analytics/getWebsiteAnalytics";



type VisitorWithCode = {
    visitors: number
    code?: string
}

/* ---------------- FORMATTERS ---------------- */

function formatCountries(map: Record<string, VisitorWithCode>) {
    return Object.entries(map).map(([name, data]) => ({
        name,
        visitors: data.visitors,
        code: data.code,
    }))
}

function formatDevices(map: Record<string, number>) {
    return Object.entries(map).map(([name, visitors]) => ({
        name,
        visitors,
        image: `/${name.toLowerCase()}.png`,
    }))
}

function formatOS(map: Record<string, number>) {
    return Object.entries(map).map(([name, visitors]) => ({
        name,
        visitors,
        image: `/${name.toLowerCase()}.png`,
    }))
}

function formatBrowsers(map: Record<string, number>) {
    return Object.entries(map).map(([name, visitors]) => ({
        name,
        visitors,
        image: `/${name.toLowerCase()}.png`,
    }))
}

/* ---------------- GET ---------------- */


export async function GET(req: Request) {
    try {
        const user = await getServerUser()


        if (!user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        /* ---------------- USER WEBSITES ---------------- */

        const websites = await db
            .select()
            .from(websitesTable)
            .where(eq(websitesTable.userEmail, user.email))
            .orderBy(websitesTable.id)

        if (!websites.length) {
            return NextResponse.json({ websites: [] })
        }

        /* ---------------- TIME RANGE ---------------- */

        const now = Math.floor(Date.now() / 1000) // секунды
        const last24h = now - 24 * 60 * 60





        const response = []

        /* ---------------- LOOP WEBSITES ---------------- */

        for (const site of websites) {
            const analytics = await getWebsiteAnalytics(site)
            response.push(analytics)
        }

        return NextResponse.json({ data: response })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}