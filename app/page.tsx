"use client"
import React from "react";
import Hero from "@/components/Hero";
import { useAuth } from "@/context/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserIcon, TrendingUp } from "lucide-react";

import {
    FaDiscord,
    FaGithub,
    FaGoogle,
    FaSlack,
    FaStripe,
    FaTelegram,
    FaTwitter,
    FaVk,
    FaWhatsapp,
    FaYandex,
} from "react-icons/fa";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const logoIcons = [
    { name: "ВКонтакте", icon: FaVk },
    { name: "Google", icon: FaGoogle },
    { name: "Яндекс", icon: FaYandex },
    { name: "Stripe", icon: FaStripe },
    { name: "Discord", icon: FaDiscord },
    { name: "Slack", icon: FaSlack },
    { name: "WhatsApp", icon: FaWhatsapp },
    { name: "Telegram", icon: FaTelegram },
];

const socialLinks = [
    { icon: FaTwitter, url: "https://twitter.com" },
    { icon: FaDiscord, url: "https://discord.com" },
    { icon: FaGithub, url: "https://github.com" },
    { icon: FaTelegram, url: "https://t.me" },
];

const testimonials = [
    {
        quote: "Analytity помог нам понять, откуда приходят пользователи, и оптимизировать наш трафик. Результаты показали рост конверсии на 25%.",
        name: "Ирина Смирнова",
        title: "Маркетолог",
    },
    {
        quote: "С помощью Analytity мы быстро получили отчеты по посещаемости конкурентов и смогли скорректировать стратегию продвижения.",
        name: "Владимир Кузнецов",
        title: "Менеджер по продукту",
    },
    {
        quote: "Интерфейс Analytity интуитивный и понятный. Теперь мы видим аналитику всех сайтов в одном месте и экономим часы времени на подготовку отчетов.",
        name: "Ольга Петрова",
        title: "Data Analyst",
    },
];

const yandexData = [
    { month: "Янв", visitors: 1200 },
    { month: "Фев", visitors: 1350 },
    { month: "Мар", visitors: 1100 },
    { month: "Апр", visitors: 1500 },
    { month: "Май", visitors: 1600 },
    { month: "Июн", visitors: 1700 },
];
const vkData = [
    { month: "Янв", visitors: 500 },
    { month: "Фев", visitors: 650 },
    { month: "Мар", visitors: 412 },
    { month: "Апр", visitors: 650 },
    { month: "Май", visitors: 580 },
    { month: "Июн", visitors: 940 },
];

const sberData = [
    { month: "Янв", visitors: 800 },
    { month: "Фев", visitors: 950 },
    { month: "Мар", visitors: 700 },
    { month: "Апр", visitors: 1200 },
    { month: "Май", visitors: 1250 },
    { month: "Июн", visitors: 1400 },
];

const yandexConfig = {
    visitors: { label: "Яндекс", color: "primary" },
} satisfies ChartConfig;
const vkConfig = {
    visitors: { label: "Вконтакте", color: "primary" },
} satisfies ChartConfig;

const sberConfig = {
    visitors: { label: "Сбер", color: "primary" },
} satisfies ChartConfig;

const HomePage = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <div>
            {/* Hero section */}
            <div className="relative min-h-screen w-full overflow-hidden bg-[var(--background)]">
                <div className="absolute h-[500px] w-[500px] bg-orange-500/30 blur-[140px] rounded-full -top-40 -left-40" />
                <div className="absolute h-[400px] w-[400px] bg-yellow-500 blur-[140px] rounded-full top-20 right-[-200px]" />
                <div className="absolute h-[500px] w-[500px] bg-pink-500/30 blur-[140px] rounded-full bottom-[-200px] left-1/3" />
                <div className="absolute h-[400px] w-[400px] bg-orange-500/30 blur-[140px] rounded-full top-[300px] left-1/2" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <Image src="/logo.png" alt="logo" width={140} height={140} />
                        </div>
                        <ul className="flex gap-4 text-lg items-center">
                            <Link href="/">
                                <li className="hover:text-primary transition-all cursor-pointer">Главная</li>
                            </Link>
                            <Link href="/pricing">
                                <li className="hover:text-primary transition-all cursor-pointer">Услуги</li>
                            </Link>
                        </ul>
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer hover:shadow-xl shadow">
                                        <AvatarImage src={user.avatarUrl} />
                                        <AvatarFallback className="bg-primary text-white">{user.userName[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95">
                                    <div className="px-3 py-2 border-b border-[var(--border)] mb-2">
                                        <p className="text-sm font-medium">{user.userName}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <button className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted transition" onClick={() => router.push("/myProjects")}>
                                            Мои проекты
                                        </button>
                                        <button className="relative overflow-hidden px-3 py-2 rounded-xl text-sm font-medium text-primary-foreground bg-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primaryRgb),0.6)] hover:scale-[1.02] group" onClick={() => router.push("/pricing")}>
                                            <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <span className="relative flex items-center gap-2">✨ Получить Premium</span>
                                        </button>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-[var(--border)]">
                                        <Button variant="destructive" size="sm" className="w-full" onClick={() => { logout(); toast.success("Вы успешно вышли!"); }}>
                                            Выйти
                                        </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button className="cursor-pointer" onClick={() => router.replace("/sign-up")}>
                                <UserIcon />
                                Войти
                            </Button>
                        )}
                    </div>

                    <Hero />

                    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                        <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaYandex/>
                            Яндекс
                        </CardTitle>
                        <CardDescription>Посетители за последние 6 месяцев</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={yandexConfig}>
                            <AreaChart data={yandexData} margin={{ left: 12, right: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                <Area dataKey="visitors" type="natural" fill="var(--chart-1)" fillOpacity={0.4} stroke="var(--chart-1)" />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center gap-2 text-sm">
                            Рост за месяц: +4.5% <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaVk/>
                            Вконтакте
                        </CardTitle>
                        <CardDescription>Посетители за последние 6 месяцев</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={vkConfig}>
                            <AreaChart data={vkData} margin={{ left: 12, right: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                <Area dataKey="visitors" type="natural" fill="var(--chart-1)" fillOpacity={0.4} stroke="var(--chart-1)" />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center gap-2 text-sm">
                            Рост за месяц: +2.8% <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Image src="/sber.jpg" alt="Sber" width={42} height={42} />
                            Сбер
                        </CardTitle>
                        <CardDescription>Посетители за последние 6 месяцев</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={sberConfig}>
                            <AreaChart data={sberData} margin={{ left: 12, right: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                <Area dataKey="visitors" type="natural" fill="var(--chart-2)" fillOpacity={0.4} stroke="var(--chart-2)" />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center gap-2 text-sm">
                            Рост за месяц: +3.2% <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardFooter>
                </Card>


                <Card>
                    <CardHeader>
                        <CardTitle>Bar Chart - Яндекс</CardTitle>
                        <CardDescription>Посетители по месяцам</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={yandexConfig}>
                            <BarChart data={yandexData} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="visitors" fill="var(--chart-1)" radius={4}>
                                    <LabelList dataKey="visitors" position="top" />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center gap-2 text-sm">
                            Рост за месяц: +4.5% <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Bar Chart - Вконтакте</CardTitle>
                        <CardDescription>Посетители по месяцам</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={vkConfig}>
                            <BarChart data={vkData} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="visitors" fill="var(--chart-1)" radius={4}>
                                    <LabelList dataKey="visitors" position="top" />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center gap-2 text-sm">
                            Рост за месяц: +2.8% <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Bar Chart - Сбер</CardTitle>
                        <CardDescription>Посетители по месяцам</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={sberConfig}>
                            <BarChart data={sberData} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="visitors" fill="var(--chart-2)" radius={4}>
                                    <LabelList dataKey="visitors" position="top" />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center gap-2 text-sm">
                            Рост за месяц: +3.2% <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Logo Marquee */}
            <div className="overflow-hidden py-8">
                <div className="flex animate-marquee whitespace-nowrap gap-12">
                    {logoIcons.concat(logoIcons).map((logo, index) => {
                        const Icon = logo.icon;
                        return (
                            <div key={index} className="flex items-center justify-center w-16 h-16 text-gray-300 hover:text-primary transition text-4xl">
                                <Icon />
                            </div>
                        );
                    })}
                </div>
                <style jsx>{`
          .animate-marquee {
            display: inline-flex;
            animation: marquee 60s linear infinite;
          }
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
            </div>


        </div>
    );
};

export default HomePage;
