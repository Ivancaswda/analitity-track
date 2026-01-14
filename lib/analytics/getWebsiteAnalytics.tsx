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
    let whereConditions: any[] = [
        eq(pageViewTable.websiteId, site.websiteId),
    ]

    if (range?.from) {
        const fromTimestamp = new Date(range.from).getTime()
        whereConditions.push(
            gte(pageViewTable.entryTime, String(fromTimestamp))
        )
    }

    if (range?.to) {
        // конец дня 23:59:59
        const toTimestamp = new Date(range.to)
        toTimestamp.setHours(23, 59, 59, 999)

        whereConditions.push(
            lte(pageViewTable.entryTime, String(toTimestamp.getTime()))
        )
    }

    const views = await db
        .select()
        .from(pageViewTable)
        .where(and(...whereConditions))

    /* ---------- дальше ТВОЙ КОД без изменений ---------- */

    const hourlyMap: Record<string, any> = {}
    const dailyMap: Record<
        string,
        { date: string; visitors: Set<string> }
    > = {}
    const countryCount: Record<string, VisitorWithCode> = {}
    const regionCount: Record<string, VisitorWithCode> = {}
    const cityCount: Record<string, VisitorWithCode> = {}
    const referralCount: Record<string, number> = {}
    const refParamsCount: Record<string, number> = {};
    const deviceCount: Record<string, number> = {}
    const osCount: Record<string, number> = {}
    const browserCount: Record<string, number> = {}

    let totalActiveTime = 0
    let totalSessions = 0

    views.forEach((v) => {
        if (!v.entryTime) return

        totalSessions++

        if (v.visitorId) {
            uniqueVisitors.add(v.visitorId)
        }

        if (v.totalActiveTime) {
            totalActiveTime += v.totalActiveTime
        }
        if (v.referrer) {
            referralCount[v.referrer] = (referralCount[v.referrer] || 0) + 1;
        }
        if (v.RefParams) {
            refParamsCount[v.RefParams] = (refParamsCount[v.RefParams] || 0) + 1;
        }



        const unix = Number(v.entryTime)
        if (isNaN(unix)) return

        const dateObj = new Date(unix)
        const date = dateObj.toISOString().split("T")[0]
        //daily
        if (!dailyMap[date]) {
            dailyMap[date] = {
                date,
                visitors: new Set(),
            }
        }

        if (v.visitorId) {
            dailyMap[date].visitors.add(v.visitorId)
        }
        // hourly
        const hour = dateObj.getHours()
        const hourLabel = `${hour}:00`
        const key = `${date}-${hour}`

        if (!hourlyMap[key]) {
            hourlyMap[key] = { date, hour, hourLabel, count: 0 }
        }
        hourlyMap[key].count++

        if (v.country) {
            countryCount[v.country] ??= { visitors: 0 }
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

        if (v.device) deviceCount[v.device] = (deviceCount[v.device] || 0) + 1
        if (v.os) osCount[v.os] = (osCount[v.os] || 0) + 1
        if (v.browser) browserCount[v.browser] = (browserCount[v.browser] || 0) + 1
    })

    return {
        websiteId: site.websiteId,
        domain: site.domain,
        totalSessions,
        totalActiveTime,
        totalVisitors: uniqueVisitors.size,
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
        countries: Object.entries(countryCount).map(([name, data]) => ({ name, ...data })),
        regions: Object.entries(regionCount).map(([name, data]) => ({ name, ...data })),
        cities: Object.entries(cityCount).map(([name, data]) => ({ name, ...data })),
        devices: Object.entries(deviceCount).map(([name, visitors]) => ({ name, visitors })),
        os: Object.entries(osCount).map(([name, visitors]) => ({ name, visitors })),
        browsers: Object.entries(browserCount).map(([name, visitors]) => ({ name, visitors })),
    }
}
