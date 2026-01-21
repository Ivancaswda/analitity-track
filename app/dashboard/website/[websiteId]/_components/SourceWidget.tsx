import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import Image from "next/image";
import {countryCodeToEmoji} from "@/lib/utils";




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
const TechBar = ({ title, data }: any) => {
    if (!data?.length) return null

    return (
        <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
                {title}
            </div>

            <ChartContainer
                config={{ visitors: { label: "Посетители" } }}
                className="h-[160px]"
            >
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ left: 90, right: 16 }}
                >
                    {/* Названия слева */}
                    <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={80}
                        className="text-xs"
                    />

                    <XAxis type="number" hide />

                    {/* Tooltip */}
                    <ChartTooltip
                        cursor={false}
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const item = payload[0].payload

                            return (
                                <div className="rounded-md border bg-background px-3 py-2 text-xs shadow">
                                    <div className="font-medium capitalize">
                                        {item.name}
                                    </div>
                                    <div className="text-muted-foreground">
                                        Посетители: {item.visitors}
                                    </div>
                                </div>
                            )
                        }}
                    />

                    <Bar
                        dataKey="visitors"
                        radius={4}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    )
}
const Insight = ({ text }: { text: string }) => (
    <div className="rounded-lg border p-3 text-sm">
        {text}
    </div>
)
const SourceWidget = ({ websiteInfo, loading }: any) => {
    if (!websiteInfo) {
        return
    }
    const chartConfig = {
        visitors: { label: "Visitors" },
        chrome: { label: "Chrome", color: "var(--chart-1)" },
        safari: { label: "Safari", color: "var(--chart-2)" },
        firefox: { label: "Firefox", color: "var(--chart-3)" },
        edge: { label: "Edge", color: "var(--chart-4)" },
        other: { label: "Other", color: "var(--chart-5)" },
    } satisfies ChartConfig;

    const referralData = websiteInfo?.referrals?.map((r: any) => ({
        domainName: r.referrer,
        visitors: r.visitors
    })) || [];

    const refParamsData = websiteInfo?.refParams?.map((r: any) => ({
        domainName: r.refParam,
        visitors: r.visitors
    })) || [];


    const topReferral = websiteInfo?.referrals?.[0];

    const topCountry = websiteInfo?.countries?.[0]
    const countryPercent =
        topCountry
            ? Math.round((topCountry.visitors / websiteInfo.totalSessions) * 100)
            : 0

    const topDevice = websiteInfo?.devices
        ?.slice()
        .sort((a: any, b: any) => b.visitors - a.visitors)[0];

    const directCount =
        websiteInfo?.referrals?.find(r => r.referrer === "Direct")?.visitors || 0

    const referralCount =
        websiteInfo?.totalSessions - directCount

    return (
        <Card>
            <CardContent style={{display: 'flex', flexDirection: 'column', gap: '42px'}} className="p-3  flex flex-col gap-12"> {/* чуть меньше падинг */}
                {topReferral && (
                                <div className="flex items-center gap-3 rounded-lg border p-3">
                                    <span className="text-sm text-muted-foreground">
                                        Основной источник:
                                    </span>
                                                    <span className="font-medium">
                                        {topReferral.referrer}
                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                        ({topReferral.visitors} визитов)
                                    </span>
                                </div>
                )}

                <Tabs  className=' w-full my-8' defaultValue="referrals">
                    <TabsList className="flex overflow-x-auto no-scrollbar">

                        <TabsTrigger value="referrals">Направления</TabsTrigger>
                    </TabsList>



                    <TabsContent value="referrals">
                        {referralData.length === 0 ? (
                            <EmptyChart />
                        ) : (
                            <ChartContainer config={chartConfig} className="h-[220px]">
                                <BarChart
                                    layout="vertical"
                                    data={referralData}
                                    margin={{ left: 40, right: 12 }}
                                >
                                    <YAxis
                                        dataKey="referrer"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <XAxis type="number" hide />

                                    <ChartTooltip content={<CustomTooltip />} />

                                    <Bar
                                        dataKey="visitors"
                                        fill="primary"
                                        radius={[6, 6, 6, 6]}
                                        barSize={18}
                                    >
                                        <LabelList
                                            dataKey="visitors"
                                            position="right"
                                            className="fill-muted-foreground text-xs"
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        )}
                    </TabsContent>
                </Tabs>

                {topCountry && (
                    <div className="flex items-center gap-4 rounded-lg border p-3">
                        <span className="text-sm text-muted-foreground">
                            Топ-страна:
                        </span>
                        <span className="font-medium">
                            {topCountry.name} · {countryPercent}%
                        </span>
                    </div>
                )}

                <Tabs className=''  defaultValue="Countries">
                    <TabsList>
                        <TabsTrigger value="Countries">Страны</TabsTrigger>
                        <TabsTrigger value="Cities">Города</TabsTrigger>
                        <TabsTrigger value="Regions">Регионы</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Countries">
                        {!websiteInfo?.countries?.length ? (
                            <EmptyChart />
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    layout="vertical"
                                    data={websiteInfo.countries}
                                    margin={{ left: 60 }}
                                >
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={({ x, y, payload }) => {
                                            const item = websiteInfo.countries.find(
                                                (c: any) => c.name === payload.value
                                            )

                                            return (
                                                <g transform={`translate(${x},${y})`}>
                                                    <text
                                                        x={-6}
                                                        y={0}
                                                        dy={4}
                                                        textAnchor="end"
                                                        className="text-xs fill-muted-foreground"
                                                    >
                                                        {countryCodeToEmoji(item?.code)} {payload.value}
                                                    </text>
                                                </g>
                                            )
                                        }}
                                    />
                                    <XAxis  type="number" hide />

                                    <ChartTooltip content={<CustomTooltip />} />

                                    <Bar
                                        dataKey="visitors"
                                        fill="primary"
                                        radius={[6, 6, 6, 6]}
                                        barSize={18}
                                    >
                                        <LabelList
                                            dataKey="visitors"
                                            position="right"
                                            className="fill-muted-foreground text-xs"
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        )}
                    </TabsContent>
                    <TabsContent value="Cities">
                        {!websiteInfo?.cities?.length ? (
                            <EmptyChart />
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    layout="vertical"
                                    data={websiteInfo.cities}
                                    margin={{ left: 20 }}
                                >
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <XAxis type="number" hide />

                                    <ChartTooltip content={<CustomTooltip />} />

                                    <Bar
                                        dataKey="visitors"
                                        fill="primary"
                                        radius={[6, 6, 6, 6]}
                                        barSize={18}
                                    >
                                        <LabelList
                                            dataKey="visitors"
                                            position="right"
                                            className="fill-muted-foreground text-xs"
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        )}
                    </TabsContent>
                    <TabsContent value="Regions">
                        {!websiteInfo?.regions?.length ? (
                            <EmptyChart />
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    layout="vertical"
                                    data={websiteInfo.regions}
                                    margin={{ left: 20 }}
                                >
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <XAxis type="number" hide />

                                    <ChartTooltip content={<CustomTooltip />} />

                                    <Bar
                                        dataKey="visitors"
                                        fill="primary"
                                        radius={[6, 6, 6, 6]}
                                        barSize={18}
                                    >
                                        <LabelList
                                            dataKey="visitors"
                                            position="right"
                                            className="fill-muted-foreground text-xs"
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        )}
                    </TabsContent>

                </Tabs>
                {topDevice && (
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                        <span className="text-sm text-muted-foreground">
                            Основное устройство:
                        </span>
                        <span className="font-medium capitalize">
                            {topDevice.name}
                        </span>
                    </div>
                )}

                <Tabs className=''  defaultValue="Devices">
                    <TabsList>
                        <TabsTrigger value="Devices">Устройства</TabsTrigger>
                        <TabsTrigger value="OS">OS</TabsTrigger>
                        <TabsTrigger value="Browsers">Браузеры</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Devices">
                        {!websiteInfo?.devices?.length ? (
                            <EmptyChart />
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    layout="vertical"
                                    data={websiteInfo.devices}
                                    margin={{ left: 20 }}
                                >
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <XAxis type="number" hide />

                                    <ChartTooltip content={<CustomTooltip />} />

                                    <Bar
                                        dataKey="visitors"
                                        fill="primary"
                                        radius={[6, 6, 6, 6]}
                                        barSize={18}
                                    >
                                        <LabelList
                                            dataKey="visitors"
                                            position="right"
                                            className="fill-muted-foreground text-xs"
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        )}
                    </TabsContent>
                    <TabsContent value="OS">
                        {!websiteInfo?.os?.length ? (
                            <EmptyChart />
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    layout="vertical"
                                    data={websiteInfo.os}
                                    margin={{ left: 20 }}
                                >
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <XAxis type="number" hide />

                                    <ChartTooltip content={<CustomTooltip />} />

                                    <Bar
                                        dataKey="visitors"
                                        fill="primary"
                                        radius={[6, 6, 6, 6]}
                                        barSize={18}
                                    >
                                        <LabelList
                                            dataKey="visitors"
                                            position="right"
                                            className="fill-muted-foreground text-xs"
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        )}
                    </TabsContent>
                    <TabsContent value="Browsers">
                        {!websiteInfo?.browsers?.length ? (
                            <EmptyChart />
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    layout="vertical"
                                    data={websiteInfo.browsers}
                                    margin={{ left: 20 }}
                                >
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <XAxis type="number" hide />

                                    <ChartTooltip content={<CustomTooltip />} />

                                    <Bar
                                        dataKey="visitors"
                                        fill="primary"
                                        radius={[6, 6, 6, 6]}
                                        barSize={18}
                                    >
                                        <LabelList
                                            dataKey="visitors"
                                            position="right"
                                            className="fill-muted-foreground text-xs"
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        )}
                    </TabsContent>

                </Tabs>

                <Tabs className=''  defaultValue="Insights">
                    <TabsList>
                        <TabsTrigger value="Insights">Инсайты</TabsTrigger>
                        <TabsTrigger value="Traffic">Трафик</TabsTrigger>
                        <TabsTrigger value="Tech">Технологии</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Insights">
                        <div className="space-y-3">
                            <Insight text={`Основной источник: ${topReferral?.referrer}`} />
                            <Insight text={`Топ-страна: ${topCountry?.name}`} />
                            <Insight text={`Основное устройство: ${topDevice?.name}`} />
                            <Insight
                                text={
                                    websiteInfo.totalSessions > 100
                                        ? "Достаточно данных для анализа поведения"
                                        : "Недостаточно данных для поведенческих выводов"
                                }
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="Traffic">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border p-4">
                                <div className="text-xs text-muted-foreground">Прямо</div>
                                <div className="text-xl font-semibold">{directCount}</div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="text-xs text-muted-foreground">По ссылке</div>
                                <div className="text-xl font-semibold">{referralCount}</div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="Tech">
                        <div className="space-y-6">
                            <TechBar title="Устройства" data={websiteInfo.devices} />
                            <TechBar title="ОС" data={websiteInfo.os} />
                            <TechBar title="Браузеры" data={websiteInfo.browsers} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default SourceWidget;
