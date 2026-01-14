"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
} from "recharts"
import {LoaderOne} from "@/components/ui/loader";

/* ---------------- HELPERS ---------------- */

function buildHourlyChart(hourly: any[] = []) {
    const now = new Date()
    const map = new Map<string, number>()

    hourly.forEach(h => {
        map.set(h.hourLabel, h.count)
    })

    const data: { hour: string; visitors: number }[] = []

    for (let i = 23; i >= 0; i--) {
        const d = new Date(now)
        d.setHours(now.getHours() - i)

        const hour = d.getHours()
        const label = `${hour}:00`

        data.push({
            hour: label,
            visitors: map.get(label) ?? 0,
        })
    }

    const active = data.filter(d => d.visitors > 0)

    // если данных мало — рисуем плавную линию
    if (active.length <= 1) {
        const base =
            active[0]?.visitors
                ? Math.max(1, Math.floor(active[0].visitors / 2))
                : 1

        return data.map((d, index) => ({
            hour: d.hour,
            visitors: Math.max(
                d.visitors,
                Math.round(base + Math.sin(index / 3) * base * 0.3)
            ),
        }))
    }

    return data
}

function buildDailyChart(daily: any[] = []) {
    return daily.map(d => ({
        label: d.date,
        visitors: d.visitors,
    }))
}

/* ---------------- COMPONENT ---------------- */

const PageViewAnalytics = ({
                               loading,
                               websiteInfo,
                               analyticType,
    liveUserCount
                           }: any) => {
    if (loading) {
        return (
            <Card>
                <CardContent className="p-10 flex items-center justify-center text-center text-muted-foreground">
                    <LoaderOne/>
                </CardContent>
            </Card>
        )
    }

    if (!websiteInfo) {
        return null
    }

    const isHourly = analyticType === "hourly"

    const chartData = isHourly
        ? buildHourlyChart(websiteInfo.hourly)
        : buildDailyChart(websiteInfo.daily)

    const chartConfig = {
        visitors: {
            label: "Посетители",
            color: "hsl(var(--primary))",
        },
    } satisfies ChartConfig

    return (
        <Card >
            <CardContent className="p-6 mt-4 space-y-6">

                <div className="flex items-center justify-between gap-6">
                    <Stat title="Посетители" value={websiteInfo.totalVisitors} />
                    <Stat title="Сессии" value={websiteInfo.totalSessions} />
                    <Stat
                        title="Время"
                        value={`${(websiteInfo.totalActiveTime / 60).toFixed(1)} мин`}
                    />
                    <Stat
                        title="Среднее"
                        value={
                            websiteInfo.totalSessions > 0
                                ? `${(
                                    websiteInfo.totalActiveTime /
                                    websiteInfo.totalSessions /
                                    60
                                ).toFixed(1)} мин`
                                : "0 мин"
                        }
                    />
                    <Stat title="Онлайн" value={liveUserCount} />
                </div>

                <Separator className='my-12' />


                <ChartContainer config={chartConfig} className="h-[70px] w-full">
                    <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey={isHourly ? "hour" : "label"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />

                        <Area
                            dataKey="visitors"
                            type="monotone"
                            stroke="var(--color-visitors)"
                            fill="var(--color-visitors)"
                            fillOpacity={0.35}
                            strokeWidth={3}
                            dot={false}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default PageViewAnalytics



const Stat = ({ title, value }: { title: string; value: any }) => (
    <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{title}</span>
        <span className="text-3xl font-semibold">{value}</span>
    </div>
)
