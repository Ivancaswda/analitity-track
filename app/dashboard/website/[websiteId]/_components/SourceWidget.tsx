import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import Image from "next/image";

const domainIcons: Record<string, string> = {
    "google.com": "https://www.google.com/favicon.ico",
    "youtube.com": "https://www.youtube.com/favicon.ico",
    "localhost": "/favicon.ico", // локальная иконка
    "facebook.com": "https://www.facebook.com/favicon.ico",
    "twitter.com": "https://twitter.com/favicon.ico",
    "duckduckgo.com": "https://duckduckgo.com/favicon.ico",
};

const SourceWidget = ({ websiteInfo, loading }: any) => {
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

    const BarLabelWithImage = (props: any) => {
        const { x, y, width, height, value } = props;

        // Выбираем иконку для известного домена, иначе дефолтная
        const domainKey = Object.keys(domainIcons).find(key => value.includes(key)) || "localhost";
        const iconSrc = domainIcons[domainKey];

        return (
            <g transform={`translate(${x + 4}, ${y + height / 2 - 8})`}>
                <Image src={iconSrc} alt={value} width={16} height={16} />
            </g>
        )
    }
    console.log(websiteInfo)

    return (
        <Card>
            <CardContent className="p-3"> {/* чуть меньше падинг */}
                <Tabs defaultValue="refParams">
                    <TabsList>
                        <TabsTrigger value="refParams">Source</TabsTrigger>
                        <TabsTrigger value="referrals">Referrals</TabsTrigger>
                    </TabsList>

                    <TabsContent value="refParams">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                layout="vertical"
                                data={refParamsData}
                                margin={{ left: 0, top: 10, bottom: 10 }}
                                barCategoryGap={10} // меньше расстояние между барами
                                barGap={4} // компактные бары
                                height={refParamsData.length * 28} // компактная высота
                            >
                                <YAxis dataKey="domainName" type="category" tickLine={false} tickMargin={6} axisLine={false} />
                                <XAxis dataKey="visitors" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="visitors" layout="vertical" radius={4} fill="var(--chart-2)" />
                                <LabelList
                                    dataKey="domainName"
                                    position="insideLeft"
                                    offset={6}
                                    fontSize={11}
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>

                    <TabsContent value="referrals">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                layout="vertical"
                                data={referralData}
                                margin={{ left: 0, top: 10, bottom: 10 }}
                                barCategoryGap={10}
                                barGap={4}
                                height={referralData.length * 28} // компактная высота
                            >
                                <YAxis dataKey="domainName" type="category" tickLine={false} tickMargin={6} axisLine={false} />
                                <XAxis dataKey="visitors" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="visitors" layout="vertical" radius={4} fill="var(--chart-1)" />
                                <LabelList
                                    dataKey="domainName"
                                    position="insideLeft"
                                    offset={6}
                                    fontSize={11}
                                    content={BarLabelWithImage} // иконки
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>

                <Tabs defaultValue="Countries">
                    <TabsList>
                        <TabsTrigger value="Countries">Страны</TabsTrigger>
                        <TabsTrigger value="Cities">Города</TabsTrigger>
                        <TabsTrigger value="Regions">Регионы</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Countries">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                layout="vertical"
                                data={websiteInfo?.countries?.map(r => ({ name: r.name, visitors: r.visitors })) || []}
                                margin={{ left: 0, top: 10, bottom: 10 }}
                                barCategoryGap={10} // меньше расстояние между барами
                                barGap={4} // компактные бары
                                height={(websiteInfo?.countries?.length || 1) * 28}
                            >
                                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={6} axisLine={false} />
                                <XAxis dataKey="visitors" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="visitors" layout="vertical" radius={4} fill="var(--chart-2)" />
                                <LabelList
                                    dataKey="name"
                                    position="insideLeft"
                                    offset={6}
                                    fontSize={11}
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>

                    <TabsContent value="Cities">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                layout="vertical"
                                data={websiteInfo?.cities?.map(r => ({ name: r.name, visitors: r.visitors })) || []}
                                margin={{ left: 0, top: 10, bottom: 10 }}
                                barCategoryGap={10}
                                barGap={4}
                                height={(websiteInfo?.cities?.length || 1) * 28}
                            >
                                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={6} axisLine={false} />
                                <XAxis dataKey="visitors" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="visitors" layout="vertical" radius={4} fill="var(--chart-1)" />
                                <LabelList
                                    dataKey="name"
                                    position="insideLeft"
                                    offset={6}
                                    fontSize={11}
                                    content={BarLabelWithImage} // иконки
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                    <TabsContent value="Regions">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                layout="vertical"
                                data={websiteInfo?.regions?.map(r => ({ name: r.name, visitors: r.visitors })) || []}
                                margin={{ left: 0, top: 10, bottom: 10 }}
                                barCategoryGap={10}
                                barGap={4}
                                height={(websiteInfo?.regions?.length || 1) * 28}
                            >
                                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={6} axisLine={false} />
                                <XAxis dataKey="visitors" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="visitors" layout="vertical" radius={4} fill="var(--chart-1)" />
                                <LabelList
                                    dataKey="name"
                                    position="insideLeft"
                                    offset={6}
                                    fontSize={11}
                                    content={BarLabelWithImage}
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
                <Tabs defaultValue="Devices">
                    <TabsList>
                        <TabsTrigger value="Devices">Устройства</TabsTrigger>
                        <TabsTrigger value="OS">OS</TabsTrigger>
                        <TabsTrigger value="Browsers">Браузеры</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Devices">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                layout="vertical"
                                data={websiteInfo?.devices?.map(r => ({ name: r.name, visitors: r.visitors })) || []}
                                margin={{ left: 0, top: 10, bottom: 10 }}
                                barCategoryGap={10} // меньше расстояние между барами
                                barGap={4} // компактные бары
                                height={(websiteInfo?.devices?.length || 1) * 28}
                            >
                                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={6} axisLine={false} />
                                <XAxis dataKey="visitors" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="visitors" layout="vertical" radius={4} fill="var(--chart-2)" />
                                <LabelList
                                    dataKey="name"
                                    position="insideLeft"
                                    offset={6}
                                    fontSize={11}
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>

                    <TabsContent value="OS">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                layout="vertical"
                                data={websiteInfo?.os?.map(r => ({ name: r.name, visitors: r.visitors })) || []}

                                margin={{ left: 0, top: 10, bottom: 10 }}
                                barCategoryGap={10}
                                barGap={4}
                                height={(websiteInfo?.os?.length || 1) * 28}
                            >
                                <YAxis dataKey="domainName" type="category" tickLine={false} tickMargin={6} axisLine={false} />
                                <XAxis dataKey="visitors" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="visitors" layout="vertical" radius={4} fill="var(--chart-1)" />
                                <LabelList
                                    dataKey="domainName"
                                    position="insideLeft"
                                    offset={6}
                                    fontSize={11}
                                    content={BarLabelWithImage} // иконки
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                    <TabsContent value="Browsers">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                layout="vertical"
                                data={websiteInfo?.browsers?.map(r => ({ name: r.name, visitors: r.visitors })) || []}

                                margin={{ left: 0, top: 10, bottom: 10 }}
                                barCategoryGap={10}
                                barGap={4}
                                height={(websiteInfo?.browsers?.length || 1) * 28}
                            >
                                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={6} axisLine={false} />
                                <XAxis dataKey="visitors" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="visitors" layout="vertical" radius={4} fill="var(--chart-1)" />
                                <LabelList
                                    dataKey="name"
                                    position="insideLeft"
                                    offset={6}
                                    fontSize={11}
                                    content={BarLabelWithImage}
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default SourceWidget;
