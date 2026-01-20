import { db } from "@/configs/db"
import { pageViewTable } from "@/configs/schema"
import { and, eq, gte, lte } from "drizzle-orm"

type VisitorWithCode = {
    visitors: number
    code?: string
}

type DateRange = {
    from?: string | null
    to?: string | null
}

export async function getWebsiteAnalytics(
    site: any,
    range?: DateRange
) {
    const uniqueVisitors = new Set<string>()

    const whereConditions = [
        eq(pageViewTable.websiteId, site.websiteId),
    ]

    if (range?.from) {
        const fromTs = Number(range.from)

        if (!Number.isNaN(fromTs)) {
            whereConditions.push(
                gte(pageViewTable.entryTime, fromTs)
            )
        }
    }

    if (range?.to) {
        const toTs = Number(range.to)

        if (!Number.isNaN(toTs)) {
            whereConditions.push(
                lte(pageViewTable.entryTime, toTs)
            )
        }
    }
    const views = await db
        .select()
        .from(pageViewTable)
        .where(and(...whereConditions))

    /* ---------- агрегаты ---------- */
    const hourlyMap: Record<string, any> = {}
    const dailyMap: Record<string, { date: string; visitors: Set<string> }> = {}

    const countryCount: Record<string, VisitorWithCode> = {}
    const regionCount: Record<string, VisitorWithCode> = {}
    const cityCount: Record<string, VisitorWithCode> = {}

    const referralCount: Record<string, number> = {}
    const refParamsCount: Record<string, number> = {}

    const deviceCount: Record<string, number> = {}
    const osCount: Record<string, number> = {}
    const browserCount: Record<string, number> = {}

    let totalActiveTime = 0
    let totalSessions = 0

    /* ---------- основной проход ---------- */
    views.forEach((v) => {

        if (!v.entryTime || isNaN(Number(v.entryTime))) return

        const ts = Number(v.entryTime)
        const dateObj = new Date(ts)

        if (isNaN(dateObj.getTime())) return


        totalSessions++

        if (v.visitorId) {
            uniqueVisitors.add(v.visitorId)
        }

        if (typeof v.totalActiveTime === "number") {
            totalActiveTime += v.totalActiveTime // ms
        }

        if (v.referrer) {
            referralCount[v.referrer] = (referralCount[v.referrer] || 0) + 1
        }

        if (v.refParams) {
            refParamsCount[v.refParams] = (refParamsCount[v.refParams] || 0) + 1
        }



        /* --- локальная дата --- */
        const date = dateObj.toLocaleDateString("en-CA") // YYYY-MM-DD

        /* --- daily --- */
        if (!dailyMap[date]) {
            dailyMap[date] = {
                date,
                visitors: new Set(),
            }
        }

        if (v.visitorId) {
            dailyMap[date].visitors.add(v.visitorId)
        }

        /* --- hourly --- */
        const date2 = dateObj.toISOString().slice(0, 10) // YYYY-MM-DD
        const hour = dateObj.getHours()
        const hourLabel = `${hour}:00`
        const hourKey = `${date2}-${hour}`

        if (!hourlyMap[hourKey]) {
            hourlyMap[hourKey] = {
                date: date2,
                hour,
                hourLabel,
                count: 0,
            }
        }

        hourlyMap[hourKey].count++

        /* --- geo --- */
        if (v.country) {
            countryCount[v.country] ??= {
                visitors: 0,
                code: v.countryCode
            }
            countryCount[v.country].visitors++
        }

        if (v.region) {
            regionCount[v.region] ??= { visitors: 0 }
            regionCount[v.region].visitors++
        }

        if (v.city) {
            cityCount[v.city] ??= { visitors: 0 }
            cityCount[v.city].visitors++
        }

        /* --- tech --- */
        if (v.device) deviceCount[v.device] = (deviceCount[v.device] || 0) + 1
        if (v.os) osCount[v.os] = (osCount[v.os] || 0) + 1
        if (v.browser) browserCount[v.browser] = (browserCount[v.browser] || 0) + 1
    })


    /* ---------- return ---------- */
    return {
        websiteId: site.websiteId,
        domain: site.domain,

        totalSessions,
        totalVisitors: uniqueVisitors.size,

        // ⚠️ В МИЛЛИСЕКУНДАХ — дели в UI
        totalActiveTime,

        hourly: Object.values(hourlyMap).sort(
            (a: any, b: any) =>
                a.date.localeCompare(b.date) || a.hour - b.hour
        ),

        daily: Object.values(dailyMap)
            .map(d => ({
                date: d.date,
                visitors: d.visitors.size,
            }))
            .sort((a, b) => a.date.localeCompare(b.date)),

        referrals: Object.entries(referralCount)
            .map(([referrer, visitors]) => ({ referrer, visitors }))
            .sort((a, b) => b.visitors - a.visitors),

        refParams: Object.entries(refParamsCount)
            .map(([refParam, visitors]) => ({ refParam, visitors }))
            .sort((a, b) => b.visitors - a.visitors),

        countries: Object.entries(countryCount).map(([name, data]: any) => ({
            name,
            visitors: data.visitors,
            code: data.code || null
        })),
        regions: Object.entries(regionCount).map(([name, data]) => ({ name, ...data })),
        cities: Object.entries(cityCount).map(([name, data]) => ({ name, ...data })),

        devices: Object.entries(deviceCount).map(([name, visitors]) => ({ name, visitors })),
        os: Object.entries(osCount).map(([name, visitors]) => ({ name, visitors })),
        browsers: Object.entries(browserCount).map(([name, visitors]) => ({ name, visitors })),
    }
}
