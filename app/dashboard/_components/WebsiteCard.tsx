import React, {useState} from "react"
import {GlobeIcon, TrendingUp, UsersIcon} from "lucide-react"
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
import {Button} from "@/components/ui/button";

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

    // ключ: YYYY-MM-DD-HH
    const map = new Map<string, number>()

    hourly.forEach(h => {
        const key = `${h.date}-${h.hour}`
        map.set(key, h.count)
    })

    const data: { hour: string; visitors: number }[] = []

    for (let i = 23; i >= 0; i--) {
        const d = new Date(now)
        d.setHours(now.getHours() - i)

        const date = d.toISOString().slice(0, 10) // YYYY-MM-DD
        const hour = d.getHours()
        const key = `${date}-${hour}`

        data.push({
            hour: `${hour}:00`,
            visitors: map.get(key) ?? 0,
        })
    }

    return data
}



const WebsiteCard = ({ website }: any) => {
    const [mode, setMode] = useState<"hourly" | "daily">("hourly")

    const chartData =
        mode === "hourly"
            ? build24hChart(website.hourly)
            : website.daily?.map((d: any) => ({
            hour: d.date.slice(5), // MM-DD
            visitors: d.visitors,
        })) ?? []
    console.log('chartData===')
    console.log(chartData)

    console.log('hourly===')
    console.log(website)
    return (
        <Link href={`/dashboard/website/${website.websiteId}`} >
            <Card className="w-[280px] h-[250px] rounded-xl transition hover:shadow-lg">
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


                <CardContent className="flex flex-col gap-3 relative">
                    <div className="flex justify-between items-center">
                        <div className='flex items-center gap-4'>
                            <h3 className="text-2xl font-bold">
                                {website.totalSessions}

                            </h3>
                            <UsersIcon/>
                        </div>


                        <div className="flex gap-1">
                            <Button size={'sm'} variant={mode === 'daily' ? 'outline' : 'default'}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setMode("hourly")
                                    }}

                            >
                                час
                            </Button>

                            <Button size={'sm'}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setMode("daily")
                                    }}
                                variant={mode === 'hourly' ? 'outline' : 'default'}
                            >
                                дни
                            </Button>
                        </div>
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
