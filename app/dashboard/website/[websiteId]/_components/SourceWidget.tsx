import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart"
import {
    Bar,
    BarChart,
    LabelList,
    XAxis,
    YAxis,
} from "recharts"
import { countryCodeToEmoji } from "@/lib/utils"

const EmptyChart = ({ text = "Нет данных" }: { text?: string }) => (
    <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
        {text}
    </div>
)

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const item = payload[0].payload

    return (
        <div className="rounded-md border bg-background px-3 py-2 text-sm shadow">
            {item.code && <span>{countryCodeToEmoji(item.code)}</span>}
            <div className="font-medium">{item.name || item.domainName}</div>
            <div className="text-muted-foreground">
                Посетители: {item.visitors}
            </div>
        </div>
    )
}

const YellowBarChart = ({ data }: { data: any[] }) => {
    if (!data?.length) return <EmptyChart />

    const sorted = [...data].sort((a, b) => b.visitors - a.visitors).slice(0, 10)

    return (
        <ChartContainer className="h-[260px]" config={{ visitors: { label: "Посетители" } }}>
            <BarChart
                layout="vertical"
                data={sorted}
                margin={{ top: 8, right: 40, bottom: 8, left: 90 }}
            >
                <defs>
                    <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#facc15" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#fde047" stopOpacity={0.6} />
                    </linearGradient>
                </defs>

                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs fill-muted-foreground"
                />

                <XAxis type="number" hide />

                <ChartTooltip content={<CustomTooltip />} />

                <Bar
                    dataKey="visitors"
                    fill="url(#yellowGradient)"
                    radius={[8, 8, 8, 8]}
                    barSize={26}
                    activeBar={{ fill: "#facc15" }}
                >
                    <LabelList
                        dataKey="visitors"
                        position="right"
                        className="fill-muted-foreground text-xs"
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}

const SourceWidget = ({ websiteInfo }: any) => {
    if (!websiteInfo) return null

    const topCountry = websiteInfo?.countries?.[0]
    const topDevice = websiteInfo?.devices?.[0]

    return (
        <Card>
            <CardContent className="p-4 space-y-10">
                <Tabs defaultValue="countries">
                    <TabsList>
                        <TabsTrigger value="countries">Страны</TabsTrigger>
                        <TabsTrigger value="cities">Города</TabsTrigger>
                        <TabsTrigger value="regions">Регионы</TabsTrigger>
                    </TabsList>

                    <TabsContent value="countries">
                        <YellowBarChart data={websiteInfo.countries} />
                    </TabsContent>

                    <TabsContent value="cities">
                        <YellowBarChart data={websiteInfo.cities} />
                    </TabsContent>

                    <TabsContent value="regions">
                        <YellowBarChart data={websiteInfo.regions} />
                    </TabsContent>
                </Tabs>

                {topCountry && (
                    <div className="rounded-lg border p-3 text-sm">
                        🌍 Топ-страна: <b>{topCountry.name}</b>
                    </div>
                )}

                {topDevice && (
                    <div className="rounded-lg border p-3 text-sm">
                        💻 Основное устройство: <b>{topDevice.name}</b>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default SourceWidget
