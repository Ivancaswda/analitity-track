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
            {item.code && <span>{countryCodeToEmoji(item.code)} </span>}
            <div className="font-medium capitalize">
                {item.name || item.domainName}
            </div>
            <div className="text-muted-foreground">
                Посетители: {item.visitors}
            </div>
        </div>
    )
}

const YellowBarChart = ({
                            data,
                            showFlags = false,
                        }: {
    data: any[]
    showFlags?: boolean
}) => {
    if (!data?.length) return <EmptyChart />

    const sorted = [...data].sort((a, b) => b.visitors - a.visitors).slice(0, 10)

    return (
        <ChartContainer className="h-[260px]" config={{ visitors: { label: "Посетители" } }}>
            <BarChart
                layout="vertical"
                data={sorted}
                margin={{ top: 8, right: 48, bottom: 8, left: 90 }}
            >
                <defs>
                    <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#fde047" />
                    </linearGradient>
                </defs>

                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={({ x, y, payload }) => {
                        const item = sorted.find(i => i.name === payload.value)
                        return (
                            <g transform={`translate(${x},${y})`}>
                                <text
                                    x={-6}
                                    y={0}
                                    dy={4}
                                    textAnchor="end"
                                    className="text-xs fill-muted-foreground"
                                >
                                    {showFlags && item?.code
                                        ? `${countryCodeToEmoji(item.code)} ${payload.value}`
                                        : payload.value}
                                </text>
                            </g>
                        )
                    }}
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
                        className="text-xs fill-muted-foreground"
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
    const topReferral = websiteInfo?.referrals?.[0]

    return (
        <Card>
            <CardContent className="p-4 space-y-12">

                {topReferral && (
                    <div className="rounded-lg border p-3 text-sm">
                        🔗 Основной источник: <b>{topReferral.referrer}</b> ({topReferral.visitors})
                    </div>
                )}

                {/* GEO */}
                <Tabs defaultValue="Countries">
                    <TabsList>
                        <TabsTrigger value="Countries">Страны</TabsTrigger>
                        <TabsTrigger value="Cities">Города</TabsTrigger>
                        <TabsTrigger value="Regions">Регионы</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Countries">
                        <YellowBarChart data={websiteInfo.countries} showFlags />
                    </TabsContent>
                    <TabsContent value="Cities">
                        <YellowBarChart data={websiteInfo.cities} />
                    </TabsContent>
                    <TabsContent value="Regions">
                        <YellowBarChart data={websiteInfo.regions} />
                    </TabsContent>
                </Tabs>

                {/* TECH */}
                <Tabs defaultValue="Devices">
                    <TabsList>
                        <TabsTrigger value="Devices">Устройства</TabsTrigger>
                        <TabsTrigger value="OS">OS</TabsTrigger>
                        <TabsTrigger value="Browsers">Браузеры</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Devices">
                        <YellowBarChart data={websiteInfo.devices} />
                    </TabsContent>
                    <TabsContent value="OS">
                        <YellowBarChart data={websiteInfo.os} />
                    </TabsContent>
                    <TabsContent value="Browsers">
                        <YellowBarChart data={websiteInfo.browsers} />
                    </TabsContent>
                </Tabs>

                {/* INSIGHTS */}
                <Tabs defaultValue="Insights">
                    <TabsList>
                        <TabsTrigger value="Insights">Инсайты</TabsTrigger>
                        <TabsTrigger value="Tech">Технологии</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Insights">
                        <div className="space-y-3">
                            <div className="rounded-lg border p-3 text-sm">
                                🌍 Топ-страна: <b>{topCountry?.name}</b>
                            </div>
                            <div className="rounded-lg border p-3 text-sm">
                                💻 Основное устройство: <b>{topDevice?.name}</b>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="Tech">
                        <div className="space-y-6">
                            <YellowBarChart data={websiteInfo.devices} />
                            <YellowBarChart data={websiteInfo.os} />
                            <YellowBarChart data={websiteInfo.browsers} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default SourceWidget
