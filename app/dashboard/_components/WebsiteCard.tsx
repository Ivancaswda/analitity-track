import React from "react"
import { GlobeIcon, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    Tooltip,
} from "recharts"
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart"
import Link from "next/link";

/* ---------------- CONFIG ---------------- */

const chartConfig = {
    visitors: {
        label: "Посетители",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

/* ---------------- HELPERS ---------------- */

function build24hChart(hourly: any[] = []) {
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

    // 🔥 ЕСЛИ МАЛО ДАННЫХ — РИСУЕМ КРАСИВУЮ ЛИНИЮ
    if (active.length <= 1) {
        const base =
            active[0]?.visitors
                ? Math.max(1, Math.floor(active[0].visitors / 2))
                : 1

        return data.map((d, index) => {
            // лёгкая волна, чтобы линия не была плоской
            const wave = Math.sin(index / 3) * base * 0.3

            return {
                hour: d.hour,
                visitors: Math.max(
                    d.visitors,
                    Math.round(base + wave)
                ),
            }
        })
    }

    return data
}



const WebsiteCard = ({ website }: any) => {


    const chartData = build24hChart(website.hourly)
    console.log(chartData)
    return (
        <Link href={`/dashboard/website/${website.websiteId}`} >
            <Card className="w-[280px] h-[220px] rounded-xl transition hover:shadow-lg">
                {/* Header */}
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="p-2 bg-primary rounded-md text-white">
                        <GlobeIcon className="w-4 h-4" />
                    </div>

                    <div className="overflow-hidden">
                        <h2 className="font-semibold text-sm truncate">
                            {website.domain.replace(/^https?:\/\//, "")}
                        </h2>
                        <p className="text-xs text-muted-foreground">Активен</p>
                    </div>
                </CardHeader>


                <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">
                            {website.totalSessions}
                        </h3>

                        <span className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            24ч
          </span>
                    </div>

                    <ChartContainer config={chartConfig} className="h-[72px] w-full">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 8, left: 0, right: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-visitors)" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="var(--color-visitors)" stopOpacity={0.08} />
                                </linearGradient>
                            </defs>



                            <XAxis dataKey="hour" hide />

                            <Area
                                dataKey="visitors"
                                type="monotone"
                                stroke="oklch(0.8283 0.1590 97.0387)"
                                strokeWidth={3}
                                fill="oklch(0.8283 0.1590 97.0387)"
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </AreaChart>
                    </ChartContainer>

                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600 font-medium">
                        +{website.totalSessions}
                      </span>{" "}
                        визитов за 24 часа
                    </p>
                </CardContent>
            </Card>
        </Link>

    )
}

export default WebsiteCard
